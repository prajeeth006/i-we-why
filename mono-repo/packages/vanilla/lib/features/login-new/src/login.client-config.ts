import { Injectable } from '@angular/core';

import {
    ClientConfigProductName,
    ContentItem,
    FormElementTemplateForClient,
    LazyClientConfig,
    LazyClientConfigBase,
    LazyClientConfigService,
    MenuContentItem,
} from '@frontend/vanilla/core';

/** @stable */
@LazyClientConfig({ key: 'vnLogin', product: ClientConfigProductName.SF })
@Injectable({
    providedIn: 'root',
    deps: [LazyClientConfigService],
    useFactory: loginConfigFactory,
})
export class LoginConfig extends LazyClientConfigBase {
    loginMessages: ContentItem[];
    newVisitor: MenuContentItem;
    betstation: MenuContentItem;
    connectCard: MenuContentItem;
    forms: { [key: string]: FormElementTemplateForClient };
    version: number;
    connectCardVersion: number;
    isMobileLoginEnabled: boolean;
    isReCaptchaEnabled: boolean;
    isRememberMeEnabled: boolean;
    loginUrl: string;
}

export function loginConfigFactory(service: LazyClientConfigService) {
    return service.get(LoginConfig);
}
