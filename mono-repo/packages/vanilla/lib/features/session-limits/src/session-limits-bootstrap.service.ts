import { Inject, Injectable } from '@angular/core';

import {
    CookieName,
    CookieService,
    LOGIN_RESPONSE_HANDLER_HOOK,
    LoginResponseHandlerHook,
    LoginResponseHandlerService,
    LoginStoreService,
    OnFeatureInit,
    RtmsMessage,
    RtmsService,
    RtmsType,
    TimeSpan,
    UserAutologout24HoursEvent,
    UserAutologoutEvent,
    UserService,
} from '@frontend/vanilla/core';
import { firstValueFrom } from 'rxjs';

import { SessionLimitsOverlayService } from './session-limits-overlay.service';
import { SessionLimitsTrackingService } from './session-limits-tracking.service';
import { SessionLimitsConfig } from './session-limits.client-config';
import { GreeceSessionLogout, SessionLimit, SessionLimitNotification, SessionLimitPreLogoutNotification } from './session-limits.models';

@Injectable()
export class SessionLimitsBootstrapService implements OnFeatureInit {
    constructor(
        private rtmsService: RtmsService,
        private sessionLimitsOverlayService: SessionLimitsOverlayService,
        private user: UserService,
        private sessionLimitsConfig: SessionLimitsConfig,
        private tracking: SessionLimitsTrackingService,
        private cookieService: CookieService,
        private loginStoreService: LoginStoreService,
        private loginResponseHandlerService: LoginResponseHandlerService,
        @Inject(LOGIN_RESPONSE_HANDLER_HOOK) private sessionLimitsLoginResponseHandlerHook: LoginResponseHandlerHook[],
    ) {}

    async onFeatureInit() {
        await firstValueFrom(this.sessionLimitsConfig.whenReady);

        this.loginResponseHandlerService.registerHooks(this.sessionLimitsLoginResponseHandlerHook);

        const limits = this.loginStoreService.PostLoginValues?.loginSessionLimitsElapsed;

        if (limits && this.user.isAuthenticated && this.sessionLimitsConfig.version === 1 && this.cookieService.get(CookieName.SessionLimits)) {
            this.sessionLimitsOverlayService.show(limits);
        }

        this.rtmsService.messages.subscribe((message: RtmsMessage) => {
            switch (message.type) {
                case RtmsType.SESSION_LIMIT_NOTIFICATION_EVENT:
                    this.handleNotificationEvent(message.payload);
                    break;
                case RtmsType.SESSION_LIMITS_PRE_LOGOUT_NOTIFICATION:
                    this.handlePreLogoutNotificationEvent(message.payload);
                    break;
                case RtmsType.GREECE_TAX_SESSION_LOGOUT:
                    this.handleGreeceTaxSessionLogoutEvent(message.payload);
                    break;
            }
        });
    }

    private handleNotificationEvent(payload: SessionLimitNotification) {
        if (this.sessionLimitsConfig.version === 1) {
            this.handleV1(payload);
        } else {
            this.sessionLimitsOverlayService.handlePendingLimits(payload);
        }
    }

    private handleV1(payload: SessionLimitNotification) {
        const limitsReached = payload.sessionLimits.filter((limit: SessionLimit) => limit.percentageElapsed === 100);

        if (limitsReached.length > 0) {
            this.tracking.trackSessionLimitsEvent(limitsReached, 'Load', 'not applicable', 'Logout Session Duration Limits Interceptor');

            if (this.sessionLimitsConfig.isAutoLogoutEnabled) {
                this.user.triggerEvent(new UserAutologoutEvent());
            }
        } else {
            this.sessionLimitsOverlayService.show(payload);
        }
    }

    private handlePreLogoutNotificationEvent(payload: SessionLimitPreLogoutNotification) {
        const configuredTime = Math.floor(payload.configuredTimeMillis / 60000);
        const remainingTime = Math.floor(payload.remainingTimeMillis / 60000);

        const notification: SessionLimitNotification = {
            accountName: payload.accountName,
            sessionLimits: [
                {
                    percentageElapsed: Math.floor((remainingTime / configuredTime) * 100),
                    sessionLimitType: payload.sessionLimits[0],
                    sessionLimitConfiguredMins: configuredTime,
                    sessionLimitElaspedMins: Math.abs(configuredTime - remainingTime),
                },
            ],
        };

        this.sessionLimitsOverlayService.show(notification);
    }

    private handleGreeceTaxSessionLogoutEvent(payload: GreeceSessionLogout) {
        if (payload.globalSessionId === this.user.globalSession) {
            const configMins = TimeSpan.fromHours(24).totalMinutes;
            const elapsedMins = Math.round(configMins * (payload.elapsedPercentage / 100));

            const notification: SessionLimitNotification = {
                accountName: payload.accountName,
                isSessionExpired: true,
                sessionLimits: [
                    {
                        percentageElapsed: payload.elapsedPercentage,
                        sessionLimitType: payload.logoutType,
                        sessionLimitConfiguredMins: configMins,
                        sessionLimitElaspedMins: elapsedMins,
                    },
                ],
            };

            const limitsReached = notification.sessionLimits.some((limit: SessionLimit) => limit.percentageElapsed === 100);

            if (limitsReached) {
                this.tracking.trackSingleSessionLimitEvent('Load', 'Logout', 'Log out Single Session Duration Limits Interceptor');
                this.user.triggerEvent(new UserAutologout24HoursEvent());
            } else {
                this.sessionLimitsOverlayService.show(notification);
            }
        }
    }
}
