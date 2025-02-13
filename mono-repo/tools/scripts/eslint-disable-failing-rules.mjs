import { readTextFile } from '@code-pushup/utils';
import { createProjectGraphAsync, readProjectsConfigurationFromProjectGraph } from '@nx/devkit';
import { ESLint } from 'eslint';
import JSON5 from 'json5';
import { minimatch } from 'minimatch';
import minimist from 'minimist';
import fs from 'node:fs/promises';
import * as util from 'util';

const argv = minimist(process.argv.slice(2));

// If lint target is called differently
const lintTarget = 'lintTarget' in argv ? argv['lintTarget'] + '' : 'lint';
// If set to true, it will run over already analyzed projects
const runAgain = 'all' in argv;
// To skip projects, required due to memory leaks
const start = 'start' in argv ? parseInt(argv['start']) : 0;
// To run for a specific project
const projectName = 'project' in argv ? argv['project'] + '' : null;

// replace these patterns as needed
const TEST_FILE_PATTERNS = ['*.spec.ts', '*.test.ts', '**/test/**/*', '**/mock/**/*', '**/mocks/**/*', '*.cy.ts', '*.stories.ts'];

const graph = await createProjectGraphAsync({ exitOnError: true });
const projects = Object.values(readProjectsConfigurationFromProjectGraph(graph).projects)
    .filter((project) => lintTarget in (project.targets ?? {}))
    .sort((a, b) => a.root.localeCompare(b.root));

async function handleEslintForProject(project) {
    /** @type {import('@nx/eslint/src/executors/lint/schema').Schema} */
    const options = project.targets[lintTarget].options;

    const eslintrc = options.eslintConfig ?? `${project.root}/.eslintrc.json`;
    const patterns = options.lintFilePatterns ?? project.root;

    /** @type {ESLint.LintResult[]} */
    let results = [];
    let noError = false;
    /** @type {Set<string>} */
    const failingRules = new Set();
    /** @type {Set<string>} */
    const failingRulesTestsOnly = new Set();
    /** @type {Map<string, number>} */
    const errorCounts = new Map();
    /** @type {Map<string, number>} */
    const warningCounts = new Map();

    while (true) {
        const eslint = new ESLint({
            overrideConfigFile: eslintrc,
            useEslintrc: false,
            errorOnUnmatchedPattern: false,
            resolvePluginsRelativeTo: options.resolvePluginsRelativeTo ?? undefined,
            ignorePath: options.ignorePath ?? undefined,
            rulePaths: options.rulesdir ?? [],
        });

        try {
            results = [...results, ...(await eslint.lintFiles(patterns))];
            console.log('Lint target run successfully');
            noError = true;
        } catch (e) {
            console.log('ERROR is:', e);
            const ruleRegex = /Rule: "([\w|\/-]*)"/gm;
            const rule = ruleRegex.exec(util.inspect(e))[1];
            console.log('Failing rule:', rule);
            results = [
                ...results,
                {
                    filePath: '',
                    messages: [
                        {
                            ruleId: rule,
                            severity: 2,
                        },
                    ],
                },
            ];
        }

        for (const result of results) {
            const isTestFile = TEST_FILE_PATTERNS.some((pattern) => minimatch(result.filePath, pattern));
            for (const { ruleId, severity } of result.messages) {
                if (!ruleId) {
                    continue;
                }
                if (isTestFile) {
                    if (!failingRules.has(ruleId)) {
                        failingRulesTestsOnly.add(ruleId);
                    }
                } else {
                    failingRules.add(ruleId);
                    failingRulesTestsOnly.delete(ruleId);
                }
                if (severity === 1) {
                    warningCounts.set(ruleId, (warningCounts.get(ruleId) ?? 0) + 1);
                } else {
                    errorCounts.set(ruleId, (errorCounts.get(ruleId) ?? 0) + 1);
                }
            }
        }

        /** @param {string} ruleId */
        const formatCounts = (ruleId) =>
            [
                { kind: 'error', count: errorCounts.get(ruleId) },
                { kind: 'warning', count: warningCounts.get(ruleId) },
            ]
                .filter(({ count }) => count > 0)
                .map(({ kind, count }) => (count === 1 ? `1 ${kind}` : `${count} ${kind}s`))
                .join(', ');

        if (failingRules.size > 0) {
            console.info(`• ${failingRules.size} rules need to be disabled`);
            failingRules.forEach((ruleId) => {
                console.info(`  - ${ruleId} (${formatCounts(ruleId)})`);
            });
        }
        if (failingRulesTestsOnly.size > 0) {
            console.info(`• ${failingRulesTestsOnly.size} rules need to be disabled only for test files`);
            failingRulesTestsOnly.forEach((ruleId) => {
                console.info(`  - ${ruleId} (${formatCounts(ruleId)})`);
            });
        }

        if (failingRules.size === 0 && failingRulesTestsOnly.size === 0) {
            console.info('• no rules need to be disabled, nothing to do here\n');
            return;
        }

        const failingRulesArray = Array.from(failingRules.values());
        const failingRulesTestsOnlyArray = Array.from(failingRulesTestsOnly.values());

        console.log('FAILING RULES', failingRules);

        const eslintConfig = JSON5.parse(await readTextFile(eslintrc));
        const newContent = {
            ...eslintConfig,
            rules: {
                ...(eslintConfig.rules ?? {}),
                ...failingRulesArray.reduce(
                    (acc, rule) => ({
                        ...acc,
                        [rule]: 'off',
                    }),
                    {},
                ),
            },
            ...(eslintConfig.overrides || failingRulesTestsOnlyArray.length > 0
                ? {
                      overrides: [
                          ...(eslintConfig.overrides ?? []).filter(
                              (override) => !TEST_FILE_PATTERNS.some((pattern) => override.files.includes(pattern)),
                          ),
                          ...(failingRulesTestsOnlyArray.length > 0
                              ? [
                                    {
                                        files: TEST_FILE_PATTERNS,
                                        rules: {
                                            ...failingRulesTestsOnlyArray.reduce(
                                                (acc, rule) => ({
                                                    ...acc,
                                                    [rule]: 'off',
                                                }),
                                                {},
                                            ),
                                        },
                                    },
                                ]
                              : []),
                      ],
                  }
                : {}),
        };
        await fs.writeFile(eslintrc, JSON.stringify(newContent));
        if (noError) {
            return;
        }
    }
}

for (let i = 0; i < projects.length; i++) {
    if (i < start) {
        continue;
    }
    const project = projects[i];
    if (projectName != null && project.name !== projectName) {
        continue;
    }
    console.info(`Processing Nx ${project.projectType ?? 'project'} "${project.name}" (${i + 1}/${projects.length}) ...`);
    await handleEslintForProject(project);
}

process.exit(0);
