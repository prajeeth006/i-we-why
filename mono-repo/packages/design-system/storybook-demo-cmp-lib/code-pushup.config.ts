import { cpDefaultConfig, mergeConfigs } from '@frontend/code-pushup-utils';

export default mergeConfigs(
    {
        persist: {
            outputDir: '.code-pushup/design-system-storybook-demo-cmp-lib',
            format: ['json', 'md'],
        },
    },
    await cpDefaultConfig({ nxProjectName: 'design-system-storybook-demo-cmp-lib' }),
);
