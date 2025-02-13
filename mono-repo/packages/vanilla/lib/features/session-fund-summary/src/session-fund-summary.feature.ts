import { registerLazyDslOnModuleInit, runOnFeatureInit } from '@frontend/vanilla/core';

import { SessionFundSummaryBootstrapService } from './session-fund-summary-bootstrap.service';
import { SessionFundSummaryDslValuesProvider } from './session-fund-summary-dsl-values-provider';

export function provide() {
    return [runOnFeatureInit(SessionFundSummaryBootstrapService), registerLazyDslOnModuleInit(SessionFundSummaryDslValuesProvider)];
}
