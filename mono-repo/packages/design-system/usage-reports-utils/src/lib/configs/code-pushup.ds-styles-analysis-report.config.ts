import { TokenPathName, getTokenPaths } from '@design-system/token-path-config-utils';
import path from 'node:path';

import angularDsPlugin, { recommendedRefs as angularDsRecommendedRefs } from '../plugins/ds-styles-analysis.plugin';

export const dsStylesUsageReport = async () => ({
    plugins: [
        angularDsPlugin({
            directory: './packages/design-system/ui',
            variableImportPattern: "@use '../..",
            deprecatedCssVarsFilePath: path.join(getTokenPaths(TokenPathName.DesignSystem).cssTokensPath, 'deprecated.txt'),
        }),
    ],
    categories: [
        {
            slug: 'design-system',
            title: 'Design System',
            refs: [...angularDsRecommendedRefs],
        },
    ],
});
