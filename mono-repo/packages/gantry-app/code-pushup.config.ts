import { cpDefaultConfig, mergeConfigs } from '@frontend/code-pushup-utils';

export default mergeConfigs(
    {
        persist: {
            outputDir: '.code-pushup/gantry-app',
            format: ['json', 'md'],
        },
    },
    await cpDefaultConfig({ nxProjectName: 'gantry-app' }),
);
