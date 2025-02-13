import { LazyClientConfigService, runOnFeatureInit } from '@frontend/vanilla/core';

import { RememberMeLogoutPromptBootstrapService } from './remember-me-logout-prompt-bootstrap.service';
import {
    RememberMeLogoutPromptConfig,
    rememberMeLogoutProntConfigFactory as rememberMeLogoutPromptConfigFactory,
} from './remember-me-logout-prompt.client-config';

export function provide() {
    return [
        { provide: RememberMeLogoutPromptConfig, useFactory: rememberMeLogoutPromptConfigFactory, deps: [LazyClientConfigService] },
        runOnFeatureInit(RememberMeLogoutPromptBootstrapService),
    ];
}
