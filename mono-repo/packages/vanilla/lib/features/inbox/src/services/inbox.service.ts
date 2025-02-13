import { OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Injectable, Injector } from '@angular/core';

import { DateTimeService, EventsService, InboxOpenOptions, InboxState, InboxStateChangeSource, VanillaEventNames } from '@frontend/vanilla/core';
import { HeaderBarService } from '@frontend/vanilla/features/header-bar';
import { OverlayFactory } from '@frontend/vanilla/shared/overlay-factory';
import { BehaviorSubject, Observable, ReplaySubject, combineLatest } from 'rxjs';
import { first, tap } from 'rxjs/operators';

import { INBOX_DATA, InboxData, InboxOverlayComponent } from '../components/inbox-overlay.component';
import { InboxCountService } from './inbox-count.service';
import { InboxDataService } from './inbox-data.service';
import { InboxTrackingService } from './inbox-tracking.service';
import { InboxConfig } from './inbox.client-config';

@Injectable({ providedIn: 'root' })
export class InboxService {
    private currentCount: number = 0;
    private currentRef: OverlayRef | null;
    private currentOpenTime: number;
    private closeChangeSource: InboxStateChangeSource | undefined;
    private stateStream = new BehaviorSubject<InboxState>({ isOpen: false });
    private countStream = new ReplaySubject<number>(1);

    constructor(
        private inboxTrackingService: InboxTrackingService,
        private inboxDataService: InboxDataService,
        private overlay: OverlayFactory,
        private injector: Injector,
        private inboxConfig: InboxConfig,
        private dateTimeService: DateTimeService,
        private inboxCounterService: InboxCountService,
        private headerBarService: HeaderBarService,
        private eventsService: EventsService,
    ) {
        this.inboxCounterService.count.pipe(tap((c) => (this.currentCount = c))).subscribe(this.countStream);
    }

    get state(): Observable<InboxState> {
        return this.stateStream;
    }

    get count(): Observable<number> {
        return this.countStream;
    }

    get isEnabled(): boolean {
        return true;
    }

    get panelClass(): string {
        return 'vn-inbox';
    }

    getCount(): number {
        return this.currentCount;
    }

    setState(state: InboxState) {
        this.stateStream.next(state);
    }

    open({ trackingEventName, showBackButton }: InboxOpenOptions) {
        if (this.currentRef) {
            return;
        }

        this.eventsService.raise({ eventName: VanillaEventNames.InboxOpen });

        this.count.pipe(first()).subscribe((c: number) => {
            this.inboxTrackingService.trackInboxOpened({
                eventName: trackingEventName,
                newMessagesCount: c,
            });
        });

        const overlayRef = this.overlay.create({
            panelClass: this.panelClass,
        });

        overlayRef.backdropClick().subscribe(() => this.currentRef?.detach());

        overlayRef.attachments().subscribe(() => {
            this.currentOpenTime = this.dateTimeService.now().getTime();
        });

        overlayRef.detachments().subscribe(() => {
            this.overlay.dispose(this.currentRef);
            this.currentRef = null;
            // trigger isOpen: false when inbox opened as overlay
            this.changeState();

            if (this.dateTimeService.now().getTime() - this.currentOpenTime <= 1000) {
                this.inboxTrackingService.trackInboxClosedEarly();
            }
        });

        combineLatest([this.inboxConfig.whenReady, this.inboxDataService.getContent()])
            .pipe(first())
            .subscribe(() => {
                const data: InboxData = { showBackButton };
                const portal = new ComponentPortal(
                    InboxOverlayComponent,
                    null,
                    Injector.create({
                        providers: [
                            { provide: INBOX_DATA, useValue: data },
                            { provide: OverlayRef, useValue: overlayRef },
                        ],
                        parent: this.injector,
                    }),
                );
                overlayRef.attach(portal);
            });

        this.currentRef = overlayRef;
    }

    close(source?: InboxStateChangeSource) {
        this.eventsService.raise({ eventName: VanillaEventNames.InboxClose });
        if (!this.currentRef && this.overlay.overlayRefs.has(this.panelClass)) {
            const overlayRef = this.overlay.overlayRefs?.get(this.panelClass);
            this.currentRef = overlayRef ? overlayRef : null;
        }

        if (this.currentRef) {
            this.closeChangeSource = source;
            this.currentRef.detach();
        } else {
            // trigger isOpen: false when inbox opened as route
            this.changeState();
            this.headerBarService.back();
        }
    }

    private changeState() {
        const state: InboxState = { isOpen: false };

        if (this.closeChangeSource) {
            state.changeSource = this.closeChangeSource;
        }

        this.stateStream.next(state);
    }
}
