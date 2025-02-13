import { Injectable } from '@angular/core';

import { SharedFeaturesApiService, WebWorkerService, WorkerType } from '@frontend/vanilla/core';
import { Observable, ReplaySubject } from 'rxjs';

import { SelfExclusionConfig } from './self-exclusion.client-config';

export interface SelfExclusionDetails {
    categoryId?: string;
    startDate?: string;
    endDate?: string;
}

@Injectable()
export class SelfExclusionService {
    private selfExclusionDetailsEvents = new ReplaySubject<SelfExclusionDetails>(1);

    constructor(
        private apiService: SharedFeaturesApiService,
        private config: SelfExclusionConfig,
        private webWorkerService: WebWorkerService,
    ) {}

    get details(): Observable<SelfExclusionDetails> {
        return this.selfExclusionDetailsEvents;
    }

    /** @internal */
    init() {
        this.poll();
        this.startPolling();
    }

    /** @internal */
    stopPolling() {
        this.webWorkerService.removeWorker(WorkerType.SelfExclusionPollInterval);
    }

    private startPolling() {
        this.webWorkerService.createWorker(WorkerType.SelfExclusionPollInterval, { interval: this.config.updateInterval }, () => this.poll());
    }

    private poll() {
        this.apiService.get('selfexclusion').subscribe((details: SelfExclusionDetails) => this.selfExclusionDetailsEvents.next(details));
    }
}
