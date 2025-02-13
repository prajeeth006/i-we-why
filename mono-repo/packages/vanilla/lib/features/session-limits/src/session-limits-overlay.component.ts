import { OverlayModule, OverlayRef } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, computed, inject, input, signal } from '@angular/core';

import { DsButton } from '@frontend/ui/button';
import {
    AuthService,
    LocationChangeEvent,
    NavigationService,
    SharedFeaturesApiService,
    UrlService,
    WebWorkerService,
    WorkerType,
    replacePlaceholders,
} from '@frontend/vanilla/core';
import { HeaderBarComponent } from '@frontend/vanilla/features/header-bar';
import { MenuItemComponent } from '@frontend/vanilla/features/menus';
import { FormatPipe, TrustAsHtmlPipe } from '@frontend/vanilla/shared/browser';
import { ImageComponent } from '@frontend/vanilla/shared/image';
import { mapValues } from 'lodash-es';
import { Subject, filter, firstValueFrom, takeUntil } from 'rxjs';

import { SessionLimitsItemComponent } from './session-limits-item.component';
import { SessionLimitsTrackingService } from './session-limits-tracking.service';
import { SessionLimitsConfig } from './session-limits.client-config';
import { SessionLimit, SessionLimitNotification, SessionLimitType } from './session-limits.models';

@Component({
    standalone: true,
    imports: [
        CommonModule,
        HeaderBarComponent,
        MenuItemComponent,
        OverlayModule,
        SessionLimitsItemComponent,
        TrustAsHtmlPipe,
        DsButton,
        FormatPipe,
        ImageComponent,
    ],
    selector: 'vn-session-limits-overlay',
    templateUrl: 'session-limits-overlay.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SessionLimitsOverlayComponent implements OnInit, OnDestroy {
    readonly sessionLimitsNotification = input.required<SessionLimitNotification>();

    readonly buttonsDisabled = signal<boolean>(false);
    readonly limitTypeReminder = signal<string | undefined>(undefined);
    readonly showPercentageElapsed = computed(() =>
        this.sessionLimitsNotification().sessionLimits.some((limit: SessionLimit) => limit.percentageElapsed),
    );
    readonly countdown = signal<number>(0);

    private unsubscribe = new Subject<void>();

    config = inject(SessionLimitsConfig);
    private overlayRef = inject(OverlayRef);
    private webWorkerService = inject(WebWorkerService);
    private sessionLimitsTrackingService = inject(SessionLimitsTrackingService);
    private navigationService = inject(NavigationService);
    private urlService = inject(UrlService);
    private authService = inject(AuthService);
    private api = inject(SharedFeaturesApiService);

    ngOnInit() {
        this.replaceTrackingPlaceholders();
        if (this.config.version === 3) {
            this.sessionLimitsTrackingService.trackLoadV3(this.sessionLimitsNotification());
        } else {
            this.sessionLimitsTrackingService.trackLoad(this.sessionLimitsNotification());
        }

        if (this.config.version === 1) {
            this.buttonsDisabled.set(this.config.closeWaitingTime > 0 && this.showPercentageElapsed());

            if (this.buttonsDisabled()) {
                this.countdown.set(this.config.closeWaitingTime);

                this.webWorkerService.createWorker(WorkerType.SessionLimitsInterval, { interval: 1000, runInsideAngularZone: true }, () => {
                    this.countdown.update((value: number) => value - 1);

                    if (this.countdown() === 0) {
                        this.buttonsDisabled.set(false);
                        this.webWorkerService.removeWorker(WorkerType.SessionLimitsInterval);
                    }
                });
            }
        } else {
            this.setLimitTypeReminder();
        }

        this.navigationService.locationChange
            .pipe(
                takeUntil(this.unsubscribe),
                filter((l: LocationChangeEvent) => {
                    try {
                        const previousUrl = this.urlService.parse(l.previousUrl);
                        const nextUrl = this.urlService.parse(l.nextUrl);
                        previousUrl.search.delete('q');
                        nextUrl.search.delete('q');

                        return previousUrl.absUrl() !== nextUrl.absUrl();
                    } catch {
                        return true;
                    }
                }),
            )
            .subscribe(() => this.close());
    }

    ngOnDestroy() {
        this.webWorkerService.removeWorker(WorkerType.SessionLimitsInterval);
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    updateClick() {
        this.overlayRef.detach();
    }

    trackUpdate() {
        this.sessionLimitsTrackingService.trackClickV3(
            this.sessionLimitsNotification(),
            this.config.updateCTA?.text ? this.config.updateCTA.text : '',
            this.config.updateCTA?.url ? this.config.updateCTA.url : '',
        );
    }

    async close() {
        if (this.config.version === 3) {
            this.sessionLimitsTrackingService.trackClickV3(
                this.sessionLimitsNotification(),
                this.config.content?.messages?.CloseButtonText ? this.config.content?.messages?.CloseButtonText : '',
            );
        } else {
            this.sessionLimitsTrackingService.trackClose(this.sessionLimitsNotification());
        }

        if (this.config.version === 2 || this.config.version === 3) {
            const data = this.sessionLimitsNotification().sessionLimits.map((item: SessionLimit) => item.sessionLimitType);

            if (data.length > 0) {
                await firstValueFrom(this.api.post('sessionlimits/savesessionlimitspopupaction', data));
            }
        }

        this.overlayRef.detach();
    }

    async logOut() {
        await this.authService.logout();
    }

    private setLimitTypeReminder() {
        const limitType = this.sessionLimitsTrackingService.getLimitsType(this.sessionLimitsNotification().sessionLimits);

        if (limitType) {
            let limitLabel: string | undefined;

            switch (limitType) {
                case SessionLimitType.DAILY_LIMIT:
                    limitLabel = this.config.content.messages?.DAILY_LIMIT;
                    break;
                case SessionLimitType.WEEKLY_LIMIT:
                    limitLabel = this.config.content.messages?.WEEKLY_LIMIT;
                    break;
                case SessionLimitType.MONTHLY_LIMIT:
                    limitLabel = this.config.content.messages?.MONTHLY_LIMIT;
                    break;
            }

            this.limitTypeReminder.set(
                limitLabel != undefined
                    ? limitLabel + ' ' + this.config.content.messages?.SessionReminderText
                    : this.config.content.messages?.SessionReminderText,
            );
        } else {
            this.limitTypeReminder.set(this.config.content.messages?.SessionReminderText);
        }
    }

    private replaceTrackingPlaceholders() {
        if (this.config.updateCTA.trackEvent) {
            const limits = this.sessionLimitsTrackingService.getLimitsType(this.sessionLimitsNotification().sessionLimits);

            this.config.updateCTA.trackEvent.data = mapValues(this.config.updateCTA.trackEvent.data || {}, (value) =>
                replacePlaceholders(value, { limits }),
            );
        }
    }
}
