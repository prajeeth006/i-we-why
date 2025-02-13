import { Injectable } from '@angular/core';

import {
    RtmsMessage,
    RtmsService,
    RtmsType,
    UserEvent,
    UserLoginEvent,
    UserLogoutEvent,
    UserService,
    UserSessionExpiredEvent,
    WebWorkerService,
    WorkerType,
} from '@frontend/vanilla/core';
import { Observable, ReplaySubject } from 'rxjs';
import { filter } from 'rxjs/operators';

import { InboxResourceService } from './inbox-resource.service';
import { InboxConfig } from './inbox.client-config';
import { InboxGetCountResponse } from './inbox.models';

@Injectable({ providedIn: 'root' })
export class InboxCountService {
    private countStream = new ReplaySubject<number>(1);

    constructor(
        private inboxConfig: InboxConfig,
        private inboxResourceService: InboxResourceService,
        private rtmsService: RtmsService,
        private webWorkerService: WebWorkerService,
        private user: UserService,
    ) {
        this.inboxConfig.whenReady.subscribe(() => {
            if (user.isAuthenticated) {
                this.subscribe();
            }

            user.events.pipe(filter((e: UserEvent) => e instanceof UserLoginEvent)).subscribe(() => this.subscribe());
        });
    }

    get count(): Observable<number> {
        return this.countStream;
    }

    refresh() {
        if (this.inboxConfig.useRtms) {
            this.poll();
        } else {
            this.stopPolling();
            this.poll();
            this.startPolling();
        }
    }

    private subscribe() {
        this.poll(); // Get initial count from service since rtms message might come late.

        if (this.inboxConfig.useRtms) {
            this.rtmsService.messages
                .pipe(filter((m: RtmsMessage) => m.type == RtmsType.PLAYERINBOX_UPDATE))
                .subscribe((m: RtmsMessage) => this.next(m.payload.newMsgCount));
        } else {
            this.startPolling();

            this.user.events
                .pipe(filter((e: UserEvent) => e instanceof UserSessionExpiredEvent || e instanceof UserLogoutEvent))
                .subscribe(() => this.stopPolling());
        }
    }

    private next(count: number) {
        // truncate to 99
        this.countStream.next(Math.min(count, 99));
    }

    private stopPolling() {
        this.webWorkerService.removeWorker(WorkerType.InboxCountPollInterval);
    }

    private startPolling() {
        this.webWorkerService.createWorker(WorkerType.InboxCountPollInterval, { interval: this.inboxConfig.counterPullInterval }, () => this.poll());
    }

    private poll() {
        this.inboxResourceService.getMessagesCount().subscribe((r: InboxGetCountResponse) => this.next(r.count));
    }
}
