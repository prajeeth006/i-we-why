import { Injectable } from '@angular/core';

import {
    MenuCountersService,
    UserEvent,
    UserLogoutEvent,
    UserService,
    UserSessionExpiredEvent,
    WebWorkerService,
    WorkerType,
} from '@frontend/vanilla/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

import { OffersResourceService } from './offers-resource.service';
import { KeyValue } from './offers.models';

/**
 * @whatItDoes Provides info about user's offers.
 *
 * @howToUse
 *
 * ```this.offersService.offersCount.subscribe(...);```
 *
 * @description
 *
 * Provides info about user's offers.
 *
 * @stable
 */
@Injectable({
    providedIn: 'root',
})
export class OffersService {
    private countEvents = new BehaviorSubject<KeyValue[]>([]);

    constructor(
        private offersResourceService: OffersResourceService,
        private menuCountersService: MenuCountersService,
        private user: UserService,
        private webWorkerService: WebWorkerService,
    ) {}

    get counts(): Observable<KeyValue[]> {
        return this.countEvents;
    }

    getCount(key: string): number {
        const newOffers = Array.isArray(this.countEvents.value) ? this.countEvents.value.find((o: KeyValue) => o.key === key) : null;

        return newOffers?.value || 0;
    }

    initPolling(interval: number) {
        this.user.events
            .pipe(filter((e: UserEvent) => e instanceof UserSessionExpiredEvent || e instanceof UserLogoutEvent))
            .subscribe(() => this.stopPolling());

        this.refresh();
        this.stopPolling();

        this.webWorkerService.createWorker(WorkerType.OffersTimeout, { timeout: 15000 }, () => {
            this.webWorkerService.createWorker(WorkerType.OffersInterval, { interval }, () => {
                this.refresh();
            });
        });
    }

    stopPolling() {
        this.webWorkerService.removeWorker(WorkerType.OffersTimeout);
        this.webWorkerService.removeWorker(WorkerType.OffersInterval);
    }

    private refresh() {
        this.offersResourceService.getCount().subscribe((data: any) => {
            this.countEvents.next(data.offers);
            this.menuCountersService.update();
        });
    }
}
