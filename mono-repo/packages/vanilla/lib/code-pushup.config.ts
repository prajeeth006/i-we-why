import { cpDefaultConfig, mergeConfigs } from '@frontend/code-pushup-utils';

export default mergeConfigs(
    {
        persist: {
            outputDir: '.code-pushup/vanilla-lib',
            format: ['json', 'md'],
        },
    },
    await cpDefaultConfig({ nxProjectName: 'vanilla-lib' }),
);
