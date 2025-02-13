import { Inject, Injectable } from '@angular/core';

import {
    PAGE_VIEW_DATA_PROVIDER,
    PageViewContext,
    PageViewDataProvider,
    ProductInjector,
    TrackingData,
    TrackingService,
    Utm,
} from '@frontend/vanilla/core';
import { NEVER, Observable, combineLatest, of, race } from 'rxjs';
import { catchError, first, map, timeout } from 'rxjs/operators';

import { TrackingConfig } from './tracking.client-config';
import { eventNames } from './tracking.models';

class PageView {
    data: TrackingData | null;

    private dataCallback: (() => void) | undefined;

    constructor(dataSource: Observable<TrackingData>) {
        dataSource.subscribe((data: TrackingData) => {
            this.data = data;

            if (this.dataCallback) {
                this.dataCallback();
            }
        });
    }

    onData(fn: () => void) {
        if (this.data) {
            fn();
        } else {
            this.dataCallback = fn;
        }
    }
}

@Injectable()
export class PageViewTrackingService {
    private pageViewQueue: PageView[] = [];

    constructor(
        private productInjector: ProductInjector,
        private trackingConfig: TrackingConfig,
        private trackingService: TrackingService,
        @Inject(PAGE_VIEW_DATA_PROVIDER) private currentDataProviders: PageViewDataProvider[],
    ) {}

    trackPageView(navigationId: number): void;
    trackPageView(utm: Utm): void;
    trackPageView(utm: Utm, navigationId: number): void;
    trackPageView(...args: any[]): void {
        const navigationId = this.toNumberOrDefault(args[0], this.toNumberOrDefault(args[1], 0));
        const context: PageViewContext = { navigationId, utm: args[0].utm_source === undefined ? {} : args[0] };
        const providers = Object.assign(this.productInjector.getMultiple(PAGE_VIEW_DATA_PROVIDER), this.currentDataProviders);
        const data = combineLatest(
            providers.map((p: PageViewDataProvider) => {
                return race(
                    p.getData(context),
                    NEVER.pipe(
                        timeout(this.trackingConfig.pageViewDataProviderTimeout),
                        catchError(() => of({})),
                    ),
                ).pipe(first());
            }),
        ).pipe(
            map<TrackingData[], TrackingData>((data: TrackingData[]) => {
                return Object.assign({}, ...data);
            }),
        );
        const pageView = new PageView(data);
        this.pageViewQueue.push(pageView);

        pageView.onData(() => this.processPageViewQueue());
    }

    private processPageViewQueue() {
        // eslint-disable-next-line no-constant-condition
        while (true) {
            const pageView = this.pageViewQueue[0];

            if (!pageView || !pageView.data) {
                break;
            }
            this.trackingService.triggerEvent(eventNames.pageView, pageView.data);
            this.pageViewQueue.shift();
        }
    }

    private toNumberOrDefault = (v: any, d: number) => {
        const value = Number(v);

        return isNaN(value) ? d : v;
    };
}
