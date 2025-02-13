import { createProjectGraphAsync, readProjectsConfigurationFromProjectGraph } from '@nx/devkit';
import { ESLint } from 'eslint';
import { minimatch } from 'minimatch';
import minimist from 'minimist';
import fs from 'node:fs/promises';
import path from 'node:path';

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

    const eslintrcPathExists = await fs
        .access(eslintrc, fs.constants.F_OK)
        .then(() => true)
        .catch(() => false);

    if (!eslintrcPathExists) {
        return;
    }

    const patterns = options.lintFilePatterns ?? project.root;

    const cpEslintrc = 'code-pushup.' + path.basename(eslintrc).replace(/^\./, '');
    const cpEslintrcPath = path.join(project.root, cpEslintrc);

    const cpEslintrcPathExists = await fs
        .access(cpEslintrcPath, fs.constants.F_OK)
        .then(() => true)
        .catch(() => false);

    if (cpEslintrcPathExists && !runAgain) {
        return;
    }

    const eslint = new ESLint({
        overrideConfigFile: cpEslintrcPathExists ? cpEslintrcPath : eslintrc,
        useEslintrc: false,
        errorOnUnmatchedPattern: false,
        resolvePluginsRelativeTo: options.resolvePluginsRelativeTo ?? undefined,
        ignorePath: options.ignorePath ?? undefined,
        rulePaths: options.rulesdir ?? [],
    });

    const results = await eslint.lintFiles(patterns);

    /** @type {Set<string>} */
    const failingRules = new Set();
    /** @type {Set<string>} */
    const failingRulesTestsOnly = new Set();
    /** @type {Map<string, number>} */
    const errorCounts = new Map();
    /** @type {Map<string, number>} */
    const warningCounts = new Map();

    for (const result of results) {
        const isTestFile = TEST_FILE_PATTERNS.some((pattern) => minimatch(result.filePath, pattern));
        for (const { ruleId, severity } of result.messages) {
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
        // think about introducing it always, so that we have quality file always
        //return;
    }

    /** @param {Set<string>} rules
     * @param indentLevel
     */
    const formatRules = (rules, indentLevel = 2) =>
        Array.from(rules.values())
            .sort((a, b) => {
                if (a.includes('/') !== b.includes('/')) {
                    return a.includes('/') ? 1 : -1;
                }
                return a.localeCompare(b);
            })
            .map((ruleId, i, arr) => '  '.repeat(indentLevel) + `"${ruleId}": "off"${i === arr.length - 1 ? '' : ','} // ${formatCounts(ruleId)}`)
            .join('\n')
            .replace(/,$/, '');

    /** @type {import('eslint').Linter.Config} */
    const config = `{
  "extends": ["./${cpEslintrc}"],
  // temporarily disable failing rules so \`nx ${lintTarget}\` passes
  // number of errors/warnings per rule recorded at ${new Date().toString()}
  "rules": {
${formatRules(failingRules)}
  }
  ${
      !failingRulesTestsOnly.size
          ? ''
          : `,
  "overrides": [
    {
      "files": ${JSON.stringify(TEST_FILE_PATTERNS)},
      "rules": {
${formatRules(failingRulesTestsOnly, 4)}
      }
    }
  ]`
  }
}`;

    const content = /\.c?[jt]s$/.test(eslintrc) ? `module.exports = ${config}` : config;

    if (!cpEslintrcPathExists) {
        await fs.copyFile(eslintrc, cpEslintrcPath);
        console.info(`• copied ${eslintrc} to ${cpEslintrcPath}`);
    }

    await fs.writeFile(eslintrc, content);
    console.info(`• replaced ${eslintrc} to extend ${cpEslintrc} and disable failing rules\n`);
}

const project = projects.find(({ name }) => name === projectName);
if (projectName && project) {
    console.info(`Processing Nx ${projectName}`);
    await handleEslintForProject(project);
} else if (!projectName) {
    for (let i = 0; i < projects.length; i++) {
        if (i < start) {
            continue;
        }
        const project = projects[i];
        console.info(`Processing Nx ${project.projectType ?? 'project'} "${project.name}" (${i + 1}/${projects.length}) ...`);
        await handleEslintForProject(project);
    }
} else {
    console.info(`Project with name ${projectName} not found.`);
}

process.exit(0);
