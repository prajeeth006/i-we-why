import { Injectable } from '@angular/core';

import { ClientConfigProductName, LazyClientConfig, LazyClientConfigBase, LazyClientConfigService } from '@frontend/vanilla/core';

/**
 * @stable
 */
@LazyClientConfig({ key: 'vnReCaptcha', product: ClientConfigProductName.SF })
@Injectable({
    providedIn: 'root',
    deps: [LazyClientConfigService],
    useFactory: reCaptchaConfigFactory,
})
export class ReCaptchaConfig extends LazyClientConfigBase {
    enterpriseSiteKey: string;
    theme: string;
    verificationMessage: string;
    areas: { [area: string]: boolean };
    instrumentationOnPageLoad: boolean;
}

export function reCaptchaConfigFactory(service: LazyClientConfigService) {
    return service.get(ReCaptchaConfig);
}
