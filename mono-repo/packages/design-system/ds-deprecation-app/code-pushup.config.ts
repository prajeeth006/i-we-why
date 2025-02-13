import { cpDefaultConfig, mergeConfigs } from '@frontend/code-pushup-utils';

export default mergeConfigs(
    {
        persist: {
            outputDir: '.code-pushup/ds-deprecation-app',
            format: ['json', 'md'],
        },
    },
    await cpDefaultConfig({ nxProjectName: 'ds-deprecation-app' }),
);
