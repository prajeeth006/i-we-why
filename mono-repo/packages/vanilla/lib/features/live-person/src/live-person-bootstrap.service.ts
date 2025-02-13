import { Injectable, inject } from '@angular/core';

import { Logger, NavigationService, OnFeatureInit, ParsedUrl, TimerService, UrlService, UserService, WINDOW } from '@frontend/vanilla/core';
import { IdleService } from '@frontend/vanilla/shared/idle';
import { Observable, fromEvent, merge } from 'rxjs';
import { first, takeUntil } from 'rxjs/operators';

import { LivePersonApiService } from './live-person-api.service';
import { ConditionalEvent, LivePersonConfig } from './live-person.client-config';

@Injectable()
export class LivePersonBootstrapService implements OnFeatureInit {
    private conditionalEvents: { eventName: string; urlRegex: RegExp; timeoutMilliseconds: number }[];
    private additionalActivityEvent: Observable<Event>;
    readonly #window = inject(WINDOW);

    constructor(
        private livePersonConfig: LivePersonConfig,
        private navigationService: NavigationService,
        private urlService: UrlService,
        private livePersonApiService: LivePersonApiService,
        private idleService: IdleService,
        private logger: Logger,
        private userService: UserService,
        private timerService: TimerService,
    ) {
        this.additionalActivityEvent = merge(fromEvent(this.#window, 'scroll'), fromEvent(this.#window, 'touchstart'));
    }

    onFeatureInit() {
        const nativeWindow = <any>this.#window;

        if (!nativeWindow.bwin || !nativeWindow.bwin.livepersonchat) {
            return;
        }

        this.livePersonConfig.whenReady.subscribe(() => {
            this.conditionalEvents = this.livePersonConfig.conditionalEvents?.map((x: ConditionalEvent) => {
                let regex;
                try {
                    regex = new RegExp(x.urlRegex, 'i');
                } catch (e) {
                    this.logger.errorRemote(
                        `Failed to compile regex /${x.urlRegex}/ because it's not supported on this browser. So it won't be executed for liveperson chat event name "${x.eventName}".`,
                        e,
                    );
                    regex = new RegExp('.^');
                }

                return {
                    eventName: x.eventName,
                    urlRegex: regex,
                    timeoutMilliseconds: x.timeoutMilliseconds,
                };
            });

            const globallivePersonApi = nativeWindow.bwin.livepersonchat;
            globallivePersonApi.isLivePersonPushChatEnabled = true;
            globallivePersonApi.accountId = this.livePersonConfig.accountId;

            this.sendLiveChatEvents();

            this.navigationService.locationChange.subscribe(() => {
                this.sendLiveChatEvents();
            });
        });
    }

    private sendLiveChatEvents() {
        const location = this.urlService.current();
        this.sendCashierLiveChatEvent(location);
        this.sendIdleLiveChatEvent(location);
    }

    private sendCashierLiveChatEvent(location: ParsedUrl) {
        const launchLiveChatFromCashier = (location.search.get('launchLiveChatFromCashier') || '').toUpperCase() == 'TRUE';
        const cashierEvent = (location.search.get('lpCashierEvent') || '').toLowerCase();

        if (launchLiveChatFromCashier && cashierEvent) {
            location.search.delete('launchLiveChatFromCashier');
            location.search.delete('lpCashierEvent');

            this.navigationService.goTo(location.url()).then(() => {
                this.timerService.setTimeout(
                    () =>
                        this.livePersonApiService
                            .triggerEvent(cashierEvent, {})
                            .catch((error: unknown) => this.logger.warn(`Failed to open live person chat for event ${cashierEvent}`, error)),
                    200,
                );
            });
        }
    }

    private sendIdleLiveChatEvent(location: ParsedUrl) {
        const event = this.conditionalEvents?.find((x) => x.urlRegex.test(location.absUrl()));

        if (event && event.eventName && event.timeoutMilliseconds) {
            this.idleService
                .whenIdle(event.timeoutMilliseconds, { additionalActivityEvent: this.additionalActivityEvent })
                .pipe(first(), takeUntil(this.navigationService.locationChange))
                .subscribe(() => {
                    this.livePersonApiService
                        .triggerEvent(event.eventName, {
                            userName: this.userService.username,
                            accountName: this.userService.accountId,
                            customerId: this.userService.accountId?.split('_')[0],
                        })
                        .catch((error: unknown) => {
                            this.logger.warn(`Failed to open live person chat for event ${event.eventName}`, error);
                        });
                });
        }
    }
}
