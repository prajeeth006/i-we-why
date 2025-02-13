import { InjectionToken, inject } from '@angular/core';

import { ParsedUrl } from '@frontend/vanilla/core';
import { Observable } from 'rxjs';

import { DefaultLanguageSwitcherUrlsProvider } from './default-language-switcher-urls-provider';

/**
 * @whatItDoes Providers urls for language switcher.
 *
 * @howToUse
 *
 * ```
 * @Injectable
 * export class CustomLanguageSwitcherUrlsProvider implements LanguageSwitcherUrlsProvider {
 *     constructor() {
 *     }
 *
 *     getUrls(url: ParsedUrl, languages: string[]): Observable<Map<string, string>> {
 *         const map = new Map<string, string>();
 *         languages.forEach(l => {
 *             map.set(l, getCustomUrl(url, l));
 *         })
 *
 *         return of(map);
 *     }
 *
 *     private getCustomUrl(url: ParsedUrl, lang: string) {
 *         // your logic
 *     }
 * }
 *
 * @NgModule()
 * export class LanguageSwitcherModule {
 *     static forRoot(): ModuleWithProviders<LanguageSwitcherModule> {
 *         return {
 *             ngModule: LanguageSwitcherModule,
 *             providers: [
 *                 { provide: LANGUAGE_SWITCHER_URLS_PROVIDER, useClass: CustomLanguageSwitcherUrlsProvider }
 *             ]
 *         }
 *     }
 * }
 * ```
 *
 * @stable
 */
export interface LanguageSwitcherUrlsProvider {
    getUrls(url: ParsedUrl, languages: string[]): Observable<Map<string, string>>;
}

/**
 * @stable
 */
export const LANGUAGE_SWITCHER_URLS_PROVIDER = new InjectionToken<LanguageSwitcherUrlsProvider>('language-switcher-urls-provider', {
    providedIn: 'root',
    factory: () => inject(DefaultLanguageSwitcherUrlsProvider),
});
