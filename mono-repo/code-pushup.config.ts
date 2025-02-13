import jsPackagesPlugin from '@code-pushup/js-packages-plugin';

import {
    cpUploadConfig,
    generateCategoriesRefs,
    mergeConfigs,
    nxPerformanceCategoryRefs,
    nxPerformancePlugin,
    workspaceValidationPlugin,
} from './packages/code-pushup-utils';

export default mergeConfigs(
    {
        persist: {
            outputDir: '.code-pushup/workspace',
            format: ['json', 'md'],
        },
        plugins: [
            workspaceValidationPlugin({
                runAll: true,
                reports: ['console', 'json'],
                reportsOutput: '.code-pushup/workspace',
                fileName: 'workspace-validation-report.json',
            }),
            nxPerformancePlugin({ taskGraphTasks: [], maxProjectGraphTime: 60_000 }),
            await jsPackagesPlugin({
                checks: ['outdated'], // audit fails on yarn-modern
                // dependencyGroups: ['prod', 'dev'],
                packageJsonPaths: ['package.json'],
                packageManager: 'yarn-modern',
            }),
        ],
        categories: [
            {
                slug: 'nx-validators',
                title: 'Workspace Validation',
                refs: generateCategoriesRefs(),
            },
            {
                slug: 'performance',
                title: 'Performance',
                refs: [...nxPerformanceCategoryRefs({ taskGraphTasks: [], maxProjectGraphTime: 60_000 })],
            },
            {
                slug: 'external-dependencies',
                title: 'External Dependencies',
                refs: [
                    {
                        type: 'audit',
                        plugin: 'js-packages',
                        slug: 'yarn-modern-outdated-prod',
                        weight: 1,
                    },
                ],
            },
        ],
    },
    cpUploadConfig('fe-monorepo'),
);
