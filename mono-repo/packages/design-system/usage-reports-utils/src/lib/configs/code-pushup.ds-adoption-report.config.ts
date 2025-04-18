import { CoreConfig } from '@code-pushup/models';

import { DsComponentReplacement } from '../../models';
import dsReportPlugin, { recommendedRefs as dsRecommendedRefs } from '../plugins/ds-adoption.plugin';

export const dsAdoptionReportConfig = async ({
    directory,
    projectSlug,
    reportsTitle,
    replacements = {},
}: {
    directory: string;
    projectSlug: string;
    reportsTitle: string;
    replacements?: DsComponentReplacement;
}) =>
    ({
        plugins: [
            dsReportPlugin({
                directory,
                projectSlug,
                replacements,
            }),
        ],
        categories: [
            {
                slug: 'ds-health',
                title: reportsTitle,
                refs: [...dsRecommendedRefs()],
            },
        ],
    }) satisfies CoreConfig;
