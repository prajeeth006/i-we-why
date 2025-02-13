import { runOnFeatureInit } from '@frontend/vanilla/core';

import { RecaptchaEnterpriseBootstrapService } from './recaptcha-enterprise-bootstrap.service';

export function provide() {
    return [runOnFeatureInit(RecaptchaEnterpriseBootstrapService)];
}
