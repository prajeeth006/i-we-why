import { Injectable } from '@angular/core';

import { ParsedUrl } from '@frontend/vanilla/core';
import { Observable, of } from 'rxjs';

import { LanguageSwitcherUrlsProvider } from './language-switcher-urls-provider';

/**
 * @stable
 */
@Injectable({
    providedIn: 'root',
})
export class DefaultLanguageSwitcherUrlsProvider implements LanguageSwitcherUrlsProvider {
    getUrls(url: ParsedUrl, languages: string[]): Observable<Map<string, string>> {
        const map = new Map<string, string>();

        languages.forEach((language: string) => {
            url.changeCulture(language);
            map.set(language, url.url());
        });

        return of(map);
    }
}
