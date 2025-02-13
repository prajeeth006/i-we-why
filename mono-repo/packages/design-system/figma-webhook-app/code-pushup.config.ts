import { cpDefaultConfig, mergeConfigs } from '@frontend/code-pushup-utils';

export default mergeConfigs(
    {
        persist: {
            outputDir: '.code-pushup/design-system-figma-webhook-app',
            format: ['json', 'md'],
        },
    },
    await cpDefaultConfig({ nxProjectName: 'design-system-figma-webhook-app' }),
);
