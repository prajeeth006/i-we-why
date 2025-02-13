import { Injectable } from '@angular/core';

import { DslService, ProductService, SessionStoreService, SharedFeaturesApiService } from '@frontend/vanilla/core';
import { Observable, Subject, of, startWith, switchMap } from 'rxjs';
import { filter, map, takeUntil } from 'rxjs/operators';

import { SmartBannerConfig } from './smart-banner.client-config';
import { ApplicationStoreInfo, SmartBannerData } from './smart-banner.models';

@Injectable({
    providedIn: 'root',
})
export class SmartBannerResourceService {
    get smartBannerData(): Observable<SmartBannerData> {
        return this.config.whenReady.pipe(
            filter(() => !this.closed),
            switchMap(() => this.dslService.evaluateExpression<boolean>(this.config.isEnabledCondition)),
            switchMap((enabled: boolean) => {
                if (!enabled) {
                    return of(null);
                }

                const appStoreInfo = this.config.appInfo && {
                    name: this.config.appInfo.text,
                    rating: this.config.appInfo.parameters && Number(this.config.appInfo.parameters.rating),
                };

                const data: SmartBannerData = {
                    content: this.config.content,
                    appInfo: this.config.appInfo,
                    appStoreInfo,
                    loaded: this.config.apiForDataSource !== 'PosApi',
                    showRating: appStoreInfo?.rating >= this.config.minimumRating,
                };

                if (!data.loaded) {
                    return this.getAppData().pipe(
                        map((storeInfo: ApplicationStoreInfo) => {
                            return {
                                ...data,
                                appStoreInfo: storeInfo,
                                showRating: storeInfo?.rating >= this.config.minimumRating,
                                loaded: true,
                            };
                        }),
                        startWith({ ...data, loaded: false }),
                    );
                }

                return of(data);
            }),
            takeUntil(this.unsubscribe),
            filter(Boolean),
        );
    }

    get closedCounter(): number {
        return this.sessionStoreService.get<number>(this.closedCounterKey) ?? 0;
    }

    get closed(): boolean {
        return this.closedCounter >= this.config.displayCounter;
    }

    private get closedCounterKey(): string {
        return `${this.productService.current.name}-closedCounter`;
    }

    private unsubscribe = new Subject<void>();

    constructor(
        private productService: ProductService,
        private sessionStoreService: SessionStoreService,
        private config: SmartBannerConfig,
        private dslService: DslService,
        private apiService: SharedFeaturesApiService,
    ) {}

    close() {
        this.sessionStoreService.set(this.closedCounterKey, this.closedCounter + 1);
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    private getAppData(): Observable<ApplicationStoreInfo> {
        return this.apiService.get('smartbanner', { appId: this.config.appId });
    }
}
