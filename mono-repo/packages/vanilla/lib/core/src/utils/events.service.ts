import { Injectable, signal } from '@angular/core';

import { BehaviorSubject, Observable, ReplaySubject, Subject, distinct, filter } from 'rxjs';

export enum VanillaEventNames {
    AccountMenuToggle = 'ACCOUNT_MENU_TOGGLE',
    ChatUpdate = 'CHAT_UPDATE',
    ConfirmPopupLeaveButton = 'ConfirmPopupLeaveButton',
    DepositSuccessQD = 'depositSuccessQD',
    FeatureEnabledStatus = 'FeatureEnabledStatus',
    FooterLoaded = 'FooterLoaded',
    FooterSlotLoaded = 'FooterSlotLoaded',
    InboxOpen = 'InboxOpen',
    InboxClose = 'InboxClose',
    LoginDialogClose = 'LOGIN_DIALOG_CLOSE',
    OpenOnboardingTour = 'OPEN_ONBOARDING_TOUR',
    PlayBreak = 'PLAY_BREAK',
    ProductMenuToggle = 'PRODUCT_MENU_TOGGLE',
    TriggerAnimation = 'TriggerAnimation',
    ToastrClosed = 'ToastrClosed',
    ValueTicket = 'VALUETICKET',
}

/**
 * @whatItDoes Represents an simple event.
 *
 * @stable
 */
export interface SimpleEvent {
    eventName: string;
    data?: any;
}

/**
 * @whatItDoes Simple event bus implementation.
 *
 * @stable
 */
@Injectable({
    providedIn: 'root',
})
export class EventsService {
    readonly event = signal<SimpleEvent | null>(null);

    private sourceSubject = new Subject<SimpleEvent | null>();
    private sourceBehaviorSubject = new BehaviorSubject<SimpleEvent | null>(null);
    private sourceReplaySubject = new ReplaySubject<SimpleEvent | null>();

    constructor() {
        this.sourceSubject.subscribe((event: SimpleEvent | null) => {
            this.sourceBehaviorSubject.next(event);
            this.sourceReplaySubject.next(event);
        });
    }

    /**
     * Returns current or previous events raised by the service, before or after the subscription.
     * Uses `BehaviorSubject` internally
     */
    get events(): Observable<SimpleEvent> {
        return this.sourceBehaviorSubject.pipe(filter((s: SimpleEvent | null): s is SimpleEvent => s !== null));
    }

    /**
     * Returns current events raised by the service. Not suitable for late subscribers.
     * Uses `Subject` internally
     */
    get newEvents(): Observable<SimpleEvent> {
        return this.sourceSubject.pipe(filter((s: SimpleEvent | null): s is SimpleEvent => s !== null));
    }

    /**
     * Returns all events raised by the service when subscribed to.
     * Uses `ReplaySubject` internally
     */
    get allEvents(): Observable<SimpleEvent> {
        return this.sourceReplaySubject.pipe(
            filter((s: SimpleEvent | null): s is SimpleEvent => s !== null),
            distinct((s) => JSON.stringify(s)),
        );
    }

    raise(event: SimpleEvent) {
        this.event.set(event);
        this.sourceSubject.next(event);
    }
}
