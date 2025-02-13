import { Injectable } from '@angular/core';

import { filter } from 'rxjs/operators';

import { Page } from '../../client-config/page.client-config';
import { LocationChangeEvent } from '../../navigation/navigation.models';
import { NavigationService } from '../../navigation/navigation.service';
import { QuerySearchParams } from '../../navigation/query-search-params';
import { UrlService } from '../../navigation/url.service';
import { DslCacheService } from '../dsl-cache.service';
import { DslNavigationService } from '../dsl-navigation.service';
import { DslRecorderService } from '../dsl-recorder.service';
import { DslRecordable, DslValuesProvider } from '../dsl.models';

@Injectable()
export class LocationDslValuesProvider implements DslValuesProvider {
    constructor(
        private dslRecorderService: DslRecorderService,
        dslCacheService: DslCacheService,
        private navigationService: NavigationService,
        private urlService: UrlService,
        private dslNavigationService: DslNavigationService,
        private page: Page,
    ) {
        this.navigationService.locationChange
            .pipe(filter((l: LocationChangeEvent) => l.previousUrl !== l.nextUrl))
            .subscribe(() => dslCacheService.invalidate(['location']));
    }

    getProviders(): { [provider: string]: DslRecordable } {
        return {
            Request: this.dslRecorderService
                .createRecordable('request')
                .createProperty({ name: 'ClientIP', get: () => this.page.clientIP, deps: 'location' })
                .createProperty({ name: 'IsInternal', get: () => this.page.isInternal, deps: 'location' })
                .createProperty({ name: 'IsPrerendered', get: () => this.page.isPrerendered, deps: 'location' })
                .createProperty({ name: 'CultureToken', get: () => this.dslNavigationService.location.culture, deps: 'location' })
                .createProperty({ name: 'AbsoluteUri', get: () => this.dslNavigationService.location.absUrl(), deps: 'location' })
                .createProperty({ name: 'AbsolutePath', get: () => this.dslNavigationService.location.path(), deps: 'location' })
                .createProperty({ name: 'PathAndQuery', get: () => this.dslNavigationService.location.url(), deps: 'location' })
                .createProperty({
                    name: 'Query',
                    get: () => {
                        const query = this.dslNavigationService.location.search.toString();
                        return query ? `?${query}` : '';
                    },
                    deps: 'location',
                })
                .createAction({
                    name: 'Redirect',
                    fn: (url: string, _: boolean, preserveQuery: boolean) => {
                        const parsedTargetUrl = this.urlService.parse(url);
                        if (preserveQuery) {
                            const currentQueryString = this.dslNavigationService.location.search;

                            for (const name of currentQueryString.keys()) {
                                if (!parsedTargetUrl.search.has(name)) {
                                    parsedTargetUrl.search.set(name, currentQueryString.get(name)!);
                                }
                            }
                        }
                        this.dslNavigationService.enqueueRedirect(parsedTargetUrl);
                    },
                }),
            QueryString: this.dslRecorderService
                .createRecordable('querystring')
                .createFunction({ name: 'Get', get: (name: string) => this.dslNavigationService.location.search.get(name) || '', deps: 'location' })
                .createAction({ name: 'Set', fn: (name: string, value: string) => this.modifyQueryString((qs) => qs.set(name, value)) })
                .createAction({ name: 'Remove', fn: (name: string) => this.modifyQueryString((qs) => qs.delete(name)) }),
        };
    }

    private modifyQueryString(action: (qs: QuerySearchParams) => void) {
        const parsedUrl = this.dslNavigationService.location.clone();
        action(parsedUrl.search);
        this.dslNavigationService.enqueueRedirect(parsedUrl);
    }
}
