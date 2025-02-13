import { cpDefaultConfig, mergeConfigs } from '@frontend/code-pushup-utils';

export default mergeConfigs(
    {
        persist: {
            outputDir: '.code-pushup/design-system-shared-storybook-utils',
            format: ['json', 'md'],
        },
    },
    await cpDefaultConfig({ nxProjectName: 'design-system-shared-storybook-utils' }),
);
