import { runOnFeatureInit } from '@frontend/vanilla/core';

import { RangeDatepickerBootstrapService } from './range-datepicker-bootstrap.service';

/**
 * @stable
 */
export function provide() {
    return [runOnFeatureInit(RangeDatepickerBootstrapService)];
}
