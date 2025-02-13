import { TestRunnerConfig, getStoryContext } from '@storybook/test-runner';
import { Rule } from 'axe-core';
import { checkA11y, configureAxe, injectAxe } from 'axe-playwright';

export function getTestRunnerConfig(testOutputDirectory: string): TestRunnerConfig {
    return {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        async preVisit(page: any) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            await injectAxe(page);
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        async postVisit(page: any, context) {
            // Get the entire context of a story, including parameters, args, argTypes, etc.
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            const storyContext = await getStoryContext(page, context);

            // Do not run a11y tests on disabled stories
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            if (storyContext.parameters['a11y']?.disable) {
                return;
            }

            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument
            const rules = Object.values(storyContext.parameters['a11y']?.['config']?.['rules']).map((rule) => rule as Rule);

            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            await configureAxe(page, {
                rules: rules,
            });

            await checkA11y(
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                page,
                '#storybook-root',
                {
                    detailedReport: true,
                    detailedReportOptions: {
                        html: true,
                    },
                    verbose: false,
                },
                false,
                'v2',
                {
                    outputDir: testOutputDirectory,
                    reportFileName: 'report.html',
                },
            );
        },
    };
}
