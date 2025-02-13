import { LOCALE_ID, Provider } from '@angular/core';

import { runOnAppInit } from '../bootstrap/bootstrapper.service';
import { Page } from '../client-config/page.client-config';
import { LocaleBootstrapService } from './locale-bootstrap.service';

export function provideLanguages(): Provider[] {
    return [
        {
            provide: LOCALE_ID,
            useFactory: localeFactory,
            deps: [Page],
        },
        runOnAppInit(LocaleBootstrapService),
    ];
}

export function localeFactory(page: Page) {
    return (page.useBrowserLanguage ? page.browserPreferredCulture : page.locale) || page.locale;
}
