import { registerLazyDslOnModuleInit } from '@frontend/vanilla/core';

import { UserScrubDslValuesProvider } from './user-scrub-dsl-values-provider';
import { UserScrubService } from './user-scrub.service';

export function provide() {
    return [UserScrubService, registerLazyDslOnModuleInit(UserScrubDslValuesProvider)];
}
