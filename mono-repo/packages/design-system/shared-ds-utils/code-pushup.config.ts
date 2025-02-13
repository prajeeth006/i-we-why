import { cpDefaultConfig, mergeConfigs } from '@frontend/code-pushup-utils';

export default mergeConfigs(
    {
        persist: {
            outputDir: '.code-pushup/design-system-shared-ds-utils',
            format: ['json', 'md'],
        },
    },
    await cpDefaultConfig({ nxProjectName: 'design-system-shared-ds-utils' }),
);
