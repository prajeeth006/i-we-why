import { Injectable } from '@angular/core';

import { SharedFeaturesApiService } from '@frontend/vanilla/core';
import { BehaviorSubject, Observable } from 'rxjs';

export class CurfewStatus {
    isDepositCurfewOn: boolean;
}

@Injectable({
    providedIn: 'root',
})
export class CurfewStatusService {
    private loaded = false;
    private events = new BehaviorSubject<CurfewStatus | null>(null);

    get curfewStatuses(): Observable<CurfewStatus | null> {
        return this.events;
    }

    constructor(private apiService: SharedFeaturesApiService) {}

    load() {
        if (!this.loaded) {
            this.loaded = true;

            this.apiService.get('curfewstatus').subscribe((data: any) => {
                this.events.next(data.curfewStatus);
            });
        }
    }
}
