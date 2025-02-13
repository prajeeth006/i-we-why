import { cpDefaultConfig, mergeConfigs } from '@frontend/code-pushup-utils';

export default mergeConfigs(
    {
        persist: {
            outputDir: '.code-pushup/vanilla-tracking-feature',
            format: ['json', 'md'],
        },
    },
    await cpDefaultConfig({ nxProjectName: 'vanilla-tracking-feature' }),
);
