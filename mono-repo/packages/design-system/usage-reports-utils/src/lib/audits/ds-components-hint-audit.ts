import { AuditOutput, Issue } from '@code-pushup/models';
import { crawlFileSystem, pluralizeToken, readTextFile } from '@code-pushup/utils';

import { DsAdoptionPluginOptions, DsComponentReplacement, DsComponentReplacementConfig, ReplacementGroup } from '../../models';
import { findNodesByCssClass } from '../../utils/find-nodes-by-css-class';
import { ClassToDsComponentMap } from '../plugins/class-to-ds-component-map';

export const dsComponentsHintAuditSlug = 'ds-components-hint';

export async function getClassToBeReplacedWithDsComponentAuditOutput(options: DsAdoptionPluginOptions): Promise<AuditOutput> {
    const directory = options.directory;
    const data: ReplacementGroup[] = await crawlFileSystem({
        directory,
        pattern: '^.*.html$',
        fileTransform: async (filePath: string) => {
            return await getClassesToReplace(filePath, options.replacements);
        },
    });

    const auditOutput: AuditOutput = {
        slug: dsComponentsHintAuditSlug,
        score: 1,
        value: 0,
        displayValue: displayValue(0),
    };

    const issues = toIssues(data);

    if (issues.length === 0) {
        return auditOutput;
    }

    return {
        ...auditOutput,
        score: 0,
        value: issues.length,
        displayValue: displayValue(issues.length),
        details: {
            issues,
        },
    } satisfies AuditOutput;
}

function displayValue(numberOfFiles: number): string {
    return `${pluralizeToken('classes', numberOfFiles)} should be replaced with Design System components`;
}

export function toIssues(data: ReplacementGroup[]): Issue[] {
    return data.flatMap((group) => {
        return group.replacements.map((replacement) => {
            return {
                severity: 'error',
                message: `Replace **${replacement.cssClass}** with component **${replacement.componentName}**. [Storybook](${replacement.storybookLink})`,
                source: {
                    file: group.filePath,
                    position: {
                        startLine: replacement.lineOfCode,
                    },
                },
            };
        });
    });
}

export async function getClassesToReplace(filePath: string, extendedReplacements: DsComponentReplacement = {}): Promise<ReplacementGroup> {
    const replacementsConfig = mergeReplacementConfigs(ClassToDsComponentMap, extendedReplacements);
    const classes = Object.keys(replacementsConfig);
    const componentContent = await readTextFile(filePath);
    const group: ReplacementGroup = { filePath, replacements: [] };
    classes.forEach((cssClass, index) => {
        const nodes = findNodesByCssClass(componentContent, [cssClass]);
        if (nodes.length > 0) {
            const matches = group.replacements;

            if (matches) {
                nodes.forEach((node) => {
                    matches.push({
                        cssClass,
                        lineOfCode: node.lineOfCode,
                        componentName: replacementsConfig[classes[index]].componentName,
                        storybookLink: replacementsConfig[classes[index]].storybookLink,
                    });
                });
            }
        }
    });
    return group;
}

function mergeReplacementConfigs(source1: DsComponentReplacementConfig, source2: DsComponentReplacementConfig): DsComponentReplacementConfig {
    const merged: DsComponentReplacementConfig = {};
    const source1Keys = new Set(Object.keys(source1));
    const source2Keys = new Set(Object.keys(source2));

    for (const key of source1Keys) {
        /* checking if the key is like list of strings, containing comma */
        if (key.includes(',')) {
            let splitClasses = key.replace(/ /g, '').split(',');
            splitClasses.forEach((singleClass) => {
                if (!source2Keys.has(singleClass)) {
                    merged[singleClass] = source1[key];
                }
            });
        } else if (!source2Keys.has(key)) {
            merged[key] = source1[key];
        }
    }

    for (const key of source2Keys) {
        merged[key] = source2[key];
    }

    return merged;
}
