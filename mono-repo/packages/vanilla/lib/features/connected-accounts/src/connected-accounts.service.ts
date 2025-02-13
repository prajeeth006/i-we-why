import { Injectable } from '@angular/core';

import { SharedFeaturesApiService } from '@frontend/vanilla/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ConnectedAccountsService {
    private loaded = false;
    private countEvents = new BehaviorSubject<number | null>(null);

    get count(): Observable<number | null> {
        return this.countEvents;
    }

    constructor(private apiService: SharedFeaturesApiService) {}

    load() {
        if (!this.loaded) {
            this.loaded = true;

            this.apiService.get('connectedaccounts/count').subscribe((info: any) => {
                this.countEvents.next(info.count);
            });
        }
    }
}
