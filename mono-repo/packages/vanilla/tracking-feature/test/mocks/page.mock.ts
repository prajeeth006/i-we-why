import { LanguageInfo, Page } from '@frontend/vanilla/core';
import { MockService } from 'ng-mocks';

class LanguageInfoMock implements LanguageInfo {
    constructor(
        public routeValue = 'sw',
        public nativeName = 'Swahili',
        public culture = 'sw-KE',
    ) {}
}

export const PageMock = MockService(Page, {
    lang: 'en',
    locale: 'en',
    culture: 'en',
    domain: '.bwin.dev',
    defaultLanguage: new LanguageInfoMock('en', 'English'),
    uiLanguages: [new LanguageInfoMock('en', 'English', 'en-US'), new LanguageInfoMock('de', 'Deutsch', 'de-AT')],
    hiddenLanguages: [],
    singleSignOnDomains: ['www.google.com'],
    currency: { default: 'symbol' },
    isLanguageChanged: false,
    useBrowserLanguage: false,
    loadingIndicator: {
        spinnerContent: 'spinner',
        defaultDelay: 0,
        disabledUrlPattern: '',
        externalNavigationDelay: 0,
    },
    imageProfiles: {
        default: {
            prefix: 'w',
            widthBreakpoints: [10],
        },
    },
    cookies: <any>{},
    slotStyle: <any>{},
    browserPreferredCulture: 'de-AT',
    previousVisitCulture: 'en-EN',
    breakpoints: {
        xs: 'screen and (max-width: 599px)',
        sm: 'screen and (min-width: 600px) and (max-width: 959px)',
        md: 'screen and (min-width: 960px) and (max-width: 1279px)',
    },
    environment: 'test',
});
