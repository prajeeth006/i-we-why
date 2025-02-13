import { Injectable } from '@angular/core';

import { SameSiteMode } from '../browser/browser.models';
import { ClientConfig, ClientConfigProductName } from './client-config.decorator';
import { ClientConfigService } from './client-config.service';

/**
 * @stable
 *
 */
export interface LoggingConfig {
    isEnabled: boolean;
    debounceInterval?: number;
    maxErrorsPerBatch?: number;
    disableLogLevels?: {
        [key: string]: LogRegexPattern | null;
    };
}

export interface LogRegexPattern {
    pattern: string;
    options?: string;
}

/**
 * @stable
 */
export interface LanguageInfo {
    culture: string;
    nativeName: string;
    routeValue: string;
}

export interface LoadingIndicatorConfig {
    defaultDelay: number;
    externalNavigationDelay: number;
    spinnerContent: string;
    disabledUrlPattern: string;
}

export interface ImageProfileSet {
    prefix: string;
    widthBreakpoints: number[];
}

interface EpcotConfig {
    accountMenuVersion: number;
    headerVersion: number;
}

/**
 * @stable
 */
@ClientConfig({ key: 'vnPage', product: ClientConfigProductName.SF })
@Injectable({
    providedIn: 'root',
    deps: [ClientConfigService],
    useFactory: pageFactory,
})
export class Page {
    enableDsScrollbar: boolean;
    htmlSourceTypeReplace: { [key: string]: string };
    lang: string;
    htmlLang: string;
    languageCode: string;
    culture: string;
    locale: string;
    useBrowserLanguage: boolean;
    browserPreferredCulture: string;
    domain: string;
    theme: string;
    isProduction: boolean;
    environment: string;
    isInternal: boolean;
    defaultLanguage: LanguageInfo;
    uiLanguages: LanguageInfo[];
    hiddenLanguages: LanguageInfo[];
    homePage: string;
    loginUrl: string;
    product: string;
    isAnonymousAccessRestricted: boolean;
    isLanguageChanged: boolean;
    /** @internal */
    logging: LoggingConfig;
    /** @internal */
    loadingIndicator: LoadingIndicatorConfig;
    /** @internal */
    currency: { [key: string]: string };
    /** @internal */
    userDisplayNameProperties: string[];
    /** @internal */
    singleSignOnDomains: string[];
    isProfilingEnabled: boolean;
    imageProfiles: { [set: string]: ImageProfileSet };
    cookies: { sameSiteMode: SameSiteMode; secure: boolean };
    scrollBehaviorEnabledCondition: string;
    clientIP: string;
    idleModeCaptureEnabled: boolean;
    itemPathDisplayModeEnabled: boolean;
    slotStyle: { [key: string]: { [key: string]: string } };
    previousVisitCulture: string;
    epcot: EpcotConfig;
    isPrerendered: boolean;
    crossDomainRegExG4: string;
    breakpoints: { [key: string]: string };
    singleSignOnLabels: string[];
    featureFlags: { [key: string]: boolean };
    isLoginWithMobileEnabled: boolean;
}

export function pageFactory(service: ClientConfigService) {
    return service.get(Page);
}
