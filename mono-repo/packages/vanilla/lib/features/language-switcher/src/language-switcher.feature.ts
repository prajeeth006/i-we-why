import { runOnFeatureInit } from '@frontend/vanilla/core';

import { LanguageSwitcherBootstrapService } from './language-switcher-bootstrap.service';

/**
 * @stable
 */
export function provide() {
    return [runOnFeatureInit(LanguageSwitcherBootstrapService)];
}
