import { cpDefaultConfig, mergeConfigs } from '@frontend/code-pushup-utils';

export default mergeConfigs(
    {
        persist: {
            outputDir: '.code-pushup/vanilla-nx-plugin',
            format: ['json', 'md'],
        },
    },
    await cpDefaultConfig({ nxProjectName: 'vanilla-nx-plugin' }),
);
