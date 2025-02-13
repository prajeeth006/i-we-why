import { cpDefaultConfig, mergeConfigs } from '@frontend/code-pushup-utils';

export default mergeConfigs(
    {
        persist: {
            outputDir: '.code-pushup/vanilla-testing',
            format: ['json', 'md'],
        },
    },
    await cpDefaultConfig({ nxProjectName: 'vanilla-testing' }),
);
