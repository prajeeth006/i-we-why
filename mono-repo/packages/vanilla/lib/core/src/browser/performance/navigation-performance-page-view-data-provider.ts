import { Injectable } from '@angular/core';

import { Observable, Subscriber, of } from 'rxjs';

import { Page } from '../../client-config/page.client-config';
import { PageViewContext, PageViewDataProvider, TrackingData } from '../../tracking/tracking-core.models';
import { BrowserPerformanceService } from './browser-performance.service';

@Injectable()
export class NavigationPerformancePageViewDataProvider implements PageViewDataProvider {
    constructor(
        private browserPerformanceService: BrowserPerformanceService,
        private page: Page,
    ) {}

    getData(context: PageViewContext): Observable<TrackingData> {
        if (!this.page.isProfilingEnabled || !this.browserPerformanceService.isSupported) {
            return of({});
        }

        return new Observable((observer: Subscriber<TrackingData>) => {
            const sub = this.browserPerformanceService.observeMeasurement(`van_nav${context.navigationId}`).subscribe((duration: number) => {
                observer.next({
                    'performance.nav': duration,
                });
            });

            observer.add(sub);
        });
    }
}
