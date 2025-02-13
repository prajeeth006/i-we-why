import { DOCUMENT } from '@angular/common';
import { Injectable, NgZone, inject } from '@angular/core';

import { UserLogoutEvent, UserService, WINDOW, WindowEvent } from '@frontend/vanilla/core';
import { IdleService } from '@frontend/vanilla/shared/idle';
import { Observable, Subject, fromEvent, merge } from 'rxjs';
import { filter, throttleTime } from 'rxjs/operators';

import { ScreenTimeResourcesService } from './screen-time-resource.service';
import { ScreenTimeConfig } from './screen-time.client-config';

enum VisibilityState {
    VISIBLE = 'visible',
    HIDDEN = 'hidden',
}

@Injectable()
export class ScreenTimeBrowserService {
    readonly #window = inject(WINDOW);
    private screenTimeConfig = inject(ScreenTimeConfig);
    private screenTimeResourceService = inject(ScreenTimeResourcesService);
    private idleService = inject(IdleService);
    private userService = inject(UserService);
    private zone = inject(NgZone);
    private readonly _doc = inject(DOCUMENT);
    browserVisibilityEvent: Subject<boolean> = new Subject();

    private idleDetected: boolean = false;
    private startTime: Date;
    private additionalActivityEvents: Observable<Event> = merge(fromEvent(this.#window, 'scroll'), fromEvent(this.#window, 'touchstart'));

    init() {
        this.zone.runOutsideAngular(() => {
            this.#window.addEventListener(WindowEvent.BeforeUnload, () => this.browserVisibilityEvent.next(false), false);
            this.#window.addEventListener(WindowEvent.PageHide, () => this.browserVisibilityEvent.next(false), false);
            this.#window.document.addEventListener(
                WindowEvent.VisibilityChange,
                () => this.browserVisibilityEvent.next(this._doc.visibilityState === VisibilityState.VISIBLE),
                false,
            );
            // On user inactivity, call saveTime API.
            this.idleService
                .whenIdle(this.screenTimeConfig.idleTimeout, {
                    additionalActivityEvent: merge(this.additionalActivityEvents, this.browserVisibilityEvent),
                })
                .subscribe(() => {
                    if (!this.idleDetected && this._doc.visibilityState === VisibilityState.VISIBLE) {
                        this.browserVisibilityEvent.next(false);
                        this.idleDetected = true;
                    }
                });
            // Changing browser visibility is considered an activity.
            merge(this.idleService.activity, this.additionalActivityEvents, this.browserVisibilityEvent.pipe(filter((visible) => visible))).subscribe(
                () => {
                    // If idle is detected, set idle to false and set startTime to now.
                    if (this.idleDetected) {
                        this.setStartTime();
                        this.idleDetected = false;
                    }
                },
            );
        });

        this.setStartTime();

        this.browserVisibilityEvent.pipe(filter((visible) => visible)).subscribe(() => this.setStartTime());

        merge(
            this.browserVisibilityEvent.pipe(
                filter((visible) => !visible),
                throttleTime(this.screenTimeConfig.minimumUpdateInterval),
            ),
            this.userService.events.pipe(filter((e) => e instanceof UserLogoutEvent)),
        ).subscribe(() => this.saveScreenTime());
    }

    private saveScreenTime() {
        const endTime = new Date();
        const screenTime = endTime.getTime() - this.startTime.getTime();

        if (screenTime > this.screenTimeConfig.minimumScreenTime) {
            this.screenTimeResourceService.saveScreenTime({
                startTime: this.startTime,
                screenTime: endTime,
                mac: '',
            });
        }

        this.setStartTime();
    }

    private setStartTime() {
        this.startTime = new Date();
    }
}
