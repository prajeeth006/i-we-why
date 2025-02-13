import { Injectable, inject } from '@angular/core';

import {
    CookieName,
    CookieService,
    EventsService,
    NativeAppService,
    NativeEvent,
    NativeEventType,
    RtmsService,
    RtmsType,
    SimpleEvent,
    toBoolean,
} from '@frontend/vanilla/core';
import { IdleService } from '@frontend/vanilla/shared/idle';
import { random } from 'lodash-es';
import { Observable, ObservableInput, merge } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { InactivityScreenConfig } from './inactivity-screen.client-config';
import { InactivityMode } from './inactivity-screen.models';

@Injectable({
    providedIn: 'root',
})
export class InactivityScreenService {
    private nativeAppService = inject(NativeAppService);
    private inactivityScreenConfig = inject(InactivityScreenConfig);
    private idleService = inject(IdleService);
    private rtmsService = inject(RtmsService);
    private eventsService = inject(EventsService);
    private cookieService = inject(CookieService);

    get activity(): Observable<any> {
        return this.activityEvents;
    }

    private additionalActivityEvents: ObservableInput<any> = merge(
        this.rtmsService.messages.pipe(filter((m) => m.type === RtmsType.BALANCE_UPDATE)),
        this.nativeAppService.eventsFromNative.pipe(filter((e: NativeEvent) => e.eventName?.toUpperCase() === NativeEventType.BARCODESCANNED)),
    );
    private readonly activityEvents: Observable<any>;

    constructor() {
        this.activityEvents = merge(this.idleService.activity, this.additionalActivityEvents);
    }

    whenIdle(): Observable<void> {
        const idleTimeoutWithOffset = this.inactivityScreenConfig.idleTimeout + random(0, this.inactivityScreenConfig.maxOffsetForIdleTimeout);
        return this.idleService
            .whenIdle(idleTimeoutWithOffset, {
                additionalActivityEvent: this.additionalActivityEvents,
                watchForIdleAfterFirstActivity:
                    !toBoolean(this.cookieService.get(CookieName.IsLanguageChangedCookieName)) &&
                    this.inactivityScreenConfig.mode === InactivityMode.Betstation,
            })
            .pipe(takeUntil(this.eventsService.events.pipe(filter((e: SimpleEvent) => e?.eventName === NativeEventType.RESET_TERMINAL))));
    }
}
