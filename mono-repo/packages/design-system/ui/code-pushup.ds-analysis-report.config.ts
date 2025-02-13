import { dsStylesUsageReport } from '@design-system/usage-reports-utils';
import { mergeConfigs } from '@frontend/code-pushup-utils';

export default mergeConfigs(
    {
        persist: {
            outputDir: '.code-pushup/design-system-ui',
            format: ['json', 'md'],
        },
    },
    await dsStylesUsageReport(),
);
