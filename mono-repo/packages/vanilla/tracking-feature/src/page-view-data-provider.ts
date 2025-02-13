import { Injectable } from '@angular/core';

import { PageViewContext, PageViewDataProvider, TrackingData } from '@frontend/vanilla/core';
import { Observable, of } from 'rxjs';

import { TrackingValueGettersService } from './tracking-value-getters.service';

@Injectable()
export class DefaultPageViewDataProvider implements PageViewDataProvider {
    constructor(private valueGetters: TrackingValueGettersService) {}

    getData(context: PageViewContext = { navigationId: 0, utm: null }): Observable<TrackingData> {
        let data: Record<string, string> = {
            'page.referrer': this.valueGetters.pageReferrer(),
            'page.url': this.valueGetters.locationAbsUrl(),
            'page.host': this.valueGetters.locationHost(),
            'page.pathQueryAndFragment': this.valueGetters.locationPathQueryAndFragment(),
            'page.name': this.valueGetters.pageName(),
        };

        if (this.valueGetters.isTerminal()) {
            data = {
                ...data,
                ...{
                    'page.terminalId': this.valueGetters.terminalId(),
                    'page.terminalType': this.valueGetters.terminalType(),
                    'page.shopId': this.valueGetters.shopId(),
                },
            };
        }

        if (context?.utm) {
            for (const key in context.utm) {
                if ((context.utm as any)[key]) {
                    data[key.replace('utm_', 'utms.')] = (context.utm as any)[key];
                }
            }
        }

        return of(data);
    }
}
