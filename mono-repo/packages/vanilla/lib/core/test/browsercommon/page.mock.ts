import { Mock } from 'moxxi';

import { LanguageInfo, Page } from '../../src/client-config/page.client-config';

@Mock({ of: Page })
export class PageMock extends Page {
    constructor() {
        super();

        this.lang = 'en';
        this.locale = 'en';
        this.culture = 'en';
        this.domain = '.bwin.dev';
        this.defaultLanguage = new LanguageInfoMock('en', 'English');
        this.uiLanguages = [new LanguageInfoMock('en', 'English', 'en-US'), new LanguageInfoMock('de', 'Deutsch', 'de-AT')];
        this.hiddenLanguages = [];
        this.singleSignOnDomains = ['www.google.com'];
        this.currency = { default: 'symbol' };
        this.isLanguageChanged = false;
        this.useBrowserLanguage = false;
        this.loadingIndicator = { spinnerContent: 'spinner', defaultDelay: 0, disabledUrlPattern: '', externalNavigationDelay: 0 };
        this.imageProfiles = {
            default: {
                prefix: 'w',
                widthBreakpoints: [10],
            },
        };
        this.cookies = <any>{};
        this.slotStyle = <any>{};
        this.browserPreferredCulture = 'de-AT';
        this.previousVisitCulture = 'en-EN';
        this.breakpoints = {
            xs: 'screen and (max-width: 599px)',
            sm: 'screen and (min-width: 600px) and (max-width: 959px)',
            md: 'screen and (min-width: 960px) and (max-width: 1279px)',
        };
        this.environment = 'test';
        this.isLoginWithMobileEnabled = false;
    }
}

export class LanguageInfoMock implements LanguageInfo {
    constructor(
        public routeValue = 'sw',
        public nativeName = 'Swahili',
        public culture = 'sw-KE',
    ) {}
}
