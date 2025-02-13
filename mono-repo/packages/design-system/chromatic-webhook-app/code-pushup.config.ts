import { cpDefaultConfig, mergeConfigs } from '@frontend/code-pushup-utils';

export default mergeConfigs(
    {
        persist: {
            outputDir: '.code-pushup/design-system-chromatic-webhook-app',
            format: ['json', 'md'],
        },
    },
    await cpDefaultConfig({ nxProjectName: 'design-system-chromatic-webhook-app' }),
);
