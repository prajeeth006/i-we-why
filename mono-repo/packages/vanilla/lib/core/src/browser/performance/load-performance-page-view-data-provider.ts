import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { Page } from '../../client-config/page.client-config';
import { PageViewDataProvider, TrackingData } from '../../tracking/tracking-core.models';
import { round } from '../../utils/convert';
import { PerformanceProfile } from '../browser.models';
import { BrowserPerformanceService } from './browser-performance.service';

@Injectable()
export class LoadPerformancePageViewDataProvider implements PageViewDataProvider {
    private provided = false;

    constructor(
        private browserPerformanceService: BrowserPerformanceService,
        private page: Page,
    ) {}

    getData(): Observable<TrackingData> {
        if (!this.page.isProfilingEnabled || !this.browserPerformanceService.isSupported || this.provided) {
            return of({});
        }

        this.provided = true;

        return this.browserPerformanceService.loadProfile().pipe(
            map((profile: PerformanceProfile) => {
                const clientBootstrap = profile.network.find((e: PerformanceResourceTiming) => /clientconfig/i.test(e.name));

                return {
                    'performance.assetsFetch': profile.waterfall.assetsFetch,
                    'performance.appCompilation': profile.waterfall.appCompilation,
                    'performance.appRun': profile.waterfall.appRun,
                    'performance.clientBootstrap': round(clientBootstrap && clientBootstrap.duration, NaN),
                    'performance.domContentLoaded': profile.events.domContentLoadedEvent,
                    'performance.load': profile.events.loadEvent,
                };
            }),
        );
    }
}
