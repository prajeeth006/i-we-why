import { Injectable } from '@angular/core';

import { ClientConfigProductName, LazyClientConfig, LazyClientConfigBase, LazyClientConfigService, MessageType } from '@frontend/vanilla/core';

export interface ProviderParameters {
    loginUrl: string;
    redirectUrl: string;
    clientId: string;
    appendNonce: boolean;
    welcomeDialog?: boolean;
    sdkUrl?: string;
    sdkVersion?: string;
    sdkCookie?: boolean;
    sdkLogin?: boolean;
    redirectQueryParams?: { [key: string]: string };
}

@LazyClientConfig({ key: 'vnLogin2', product: ClientConfigProductName.SF })
@Injectable({
    providedIn: 'root',
    deps: [LazyClientConfigService],
    useFactory: loginConfigFactory,
})
export class LoginConfig extends LazyClientConfigBase {
    autoFocusUsername?: boolean;
    closeButtonTextCssClass: string;
    connectCardVersion: number;
    disableLoginOnFormInvalid: boolean;
    disableFeatureDataPrefetch: { [key: string]: string };
    enableLimitsToaster: boolean;
    failedLoginRetryCount: { [key: string]: number };
    fastLoginOptionsEnabled: boolean;
    fastLoginToggleEnabled: boolean;
    isDateOfBirthEnabled: boolean;
    isLoginWithMobileEnabled: boolean;
    loginMessages: { urlPattern: string; name: string; type: MessageType }[];
    loginOptions: string[];
    passwordHintsOnNthAttempt: number;
    prefillUsernameToggleEnabled: boolean;
    providers: { [key: string]: ProviderParameters };
    recaptchaEnterpriseEnabled: boolean;
    rememberMeEnabled: boolean;
    resetLoginFormErrorCodes: string[];
    selectedTabEnabled: boolean;
    showCloseButtonAsText: boolean;
    showRegisterButton: boolean;
    signInByEmail: boolean;
    titleCssClass: string;
    useOpenRegistrationEvent: boolean;
    useProviderProfile: boolean;
    v2: boolean;
    version: number;
    showLoginSpinner: boolean;
}

export function loginConfigFactory(service: LazyClientConfigService) {
    return service.get(LoginConfig);
}
