import { Inject, Injectable, signal } from '@angular/core';

import { DslService, LanguageInfo, NavigationService, Page } from '@frontend/vanilla/core';
import { FlagsService } from '@frontend/vanilla/features/flags';
import { Observable, combineLatest, of } from 'rxjs';
import { first, map, switchMap } from 'rxjs/operators';

import { LANGUAGE_SWITCHER_URLS_PROVIDER, LanguageSwitcherUrlsProvider } from './language-switcher-urls-provider';
import { LanguageSwitcherConfig } from './language-switcher.client-config';
import { LanguageSwitcherItem } from './language-switcher.models';

@Injectable({
    providedIn: 'root',
})
export class LanguageSwitcherService {
    readonly headerEnabled = signal<boolean>(false);

    private languages: string[];
    private cachedUrl: string;
    private cachedData: Observable<LanguageSwitcherItem[]> | null = null;

    constructor(
        private page: Page,
        private flagsService: FlagsService,
        private navigationService: NavigationService,
        private config: LanguageSwitcherConfig,
        dslService: DslService,
        @Inject(LANGUAGE_SWITCHER_URLS_PROVIDER) private languageSwitcherUrlsProvider: LanguageSwitcherUrlsProvider,
    ) {
        this.languages = this.page.uiLanguages.map((language: LanguageInfo) => language.routeValue);

        this.config.whenReady
            .pipe(first())
            .subscribe(() =>
                dslService
                    .evaluateExpression<boolean>(this.config.showHeaderDslExpression)
                    .subscribe((enabled: boolean) => this.headerEnabled.set(enabled)),
            );
    }

    getLanguageSwitcherData(): Observable<LanguageSwitcherItem[]> {
        const currentUrl = this.navigationService.location.absUrl();

        if (!this.cachedData || this.cachedUrl !== currentUrl) {
            this.cachedData = this.createLanguageSwitcherData();
            this.cachedUrl = currentUrl;
        }

        return this.cachedData;
    }

    private createLanguageSwitcherData(): Observable<LanguageSwitcherItem[]> {
        return this.config.whenReady.pipe(
            first(),
            switchMap(() => {
                return combineLatest([
                    this.languageSwitcherUrlsProvider.getUrls(this.navigationService.location.clone(), this.languages),
                    this.config.version === 1 ? this.flagsService.available : of([]),
                ]).pipe(
                    map((data: any[]) => {
                        const urls = data[0];
                        const flags = data[1];

                        return this.page.uiLanguages.map((language: LanguageInfo) => {
                            const url = urls.get(language.routeValue);

                            if (!url) {
                                throw new Error(`LanguageSwitcherUrlsProvider did not return an url value for language ${language.routeValue}`);
                            }

                            const languageSwitcherItem: LanguageSwitcherItem = {
                                url,
                                routeValue: language.routeValue,
                                nativeName: language.nativeName,
                                image: flags?.find((x: any) => x.iconName === `${language.routeValue}-flag`)?.imageUrl,
                                isActive: language.routeValue === this.page.lang,
                                culture: language.culture,
                            };

                            return languageSwitcherItem;
                        });
                    }),
                );
            }),
        );
    }
}
