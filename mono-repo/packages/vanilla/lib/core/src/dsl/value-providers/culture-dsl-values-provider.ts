import { Injectable } from '@angular/core';

import { LanguageInfo, Page } from '../../client-config/page.client-config';
import { ClaimsService } from '../../user/claims.service';
import { DslRecorderService } from '../dsl-recorder.service';
import { DslRecordable, DslValuesProvider } from '../dsl.models';

@Injectable()
export class CultureDslValuesProvider implements DslValuesProvider {
    constructor(
        private dslRecorderService: DslRecorderService,
        private page: Page,
        private claimService: ClaimsService,
    ) {}

    getProviders(): { [provider: string]: DslRecordable } {
        return {
            Culture: this.dslRecorderService
                .createRecordable('culture')
                .createProperty({
                    name: 'Allowed',
                    get: () => this.page.uiLanguages.map((lang: LanguageInfo) => lang.culture).join(', '),
                    deps: [],
                })
                .createProperty({
                    name: 'Current',
                    get: () => this.page.culture,
                    deps: [],
                })
                .createProperty({
                    name: 'Default',
                    get: () => this.page.defaultLanguage.culture,
                    deps: [],
                })
                .createProperty({
                    name: 'FromBrowser',
                    get: () => this.page.browserPreferredCulture,
                    deps: [],
                })
                .createProperty({
                    name: 'FromClaims',
                    get: () => {
                        const culture = this.claimService.get('http://api.bwin.com/v3/user/culture');
                        const language = this.page.uiLanguages.find((l) => l.culture == culture);

                        if (!language) {
                            throw new Error(
                                `http://api.bwin.com/v3/user/culture contains '${culture}' which is not within configured in VanillaFramework.Web.Globalization -> ${this.page.uiLanguages
                                    .map((l) => l.culture)
                                    .join()}.
                                Most likely the user was migrated from another label or the culture was decommissioned. Fix the user on backend side or reconfigure the cultures (according to business needs).`,
                            );
                        }

                        return culture;
                    },
                    deps: [],
                })
                .createProperty({
                    name: 'FromPreviousVisit',
                    get: () => this.page.previousVisitCulture,
                    deps: [],
                })
                .createFunction({
                    name: 'GetUrlToken',
                    get: (cultureName: string) => {
                        const language = this.page.uiLanguages.find((l) => l.culture == cultureName);

                        if (!language) {
                            throw new Error(
                                `Failed to find culture by name '${cultureName}' from allowed configured cultures: ${this.page.uiLanguages
                                    .map((l: LanguageInfo) => l.culture)
                                    .join()}.`,
                            );
                        }

                        return language.routeValue;
                    },
                    deps: [],
                }),
        };
    }
}
