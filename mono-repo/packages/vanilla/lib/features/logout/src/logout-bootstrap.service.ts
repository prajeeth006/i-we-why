import { Inject, Injectable } from '@angular/core';

import {
    AuthService,
    ClaimType,
    LogoutProvidersService,
    NavigationService,
    ON_LOGOUT_PROVIDER,
    OnFeatureInit,
    OnLogoutProvider,
    RtmsMessage,
    RtmsService,
    RtmsType,
    ToastrQueueService,
    ToastrSchedule,
    UserAutologout24HoursEvent,
    UserAutologoutEvent,
    UserEvent,
    UserLoginEvent,
    UserLogoutEvent,
    UserService,
    WebWorkerService,
    WorkerType,
} from '@frontend/vanilla/core';
import { CurrentSessionConfig } from '@frontend/vanilla/shared/current-session';
import { firstValueFrom } from 'rxjs';
import { filter } from 'rxjs/operators';

import { LogoutResourceService } from './logout-resource.service';
import { LogoutConfig, LogoutMessageType } from './logout.client-config';

@Injectable()
export class LogoutBootstrapService implements OnFeatureInit {
    constructor(
        private user: UserService,
        private rtmsService: RtmsService,
        private logoutConfig: LogoutConfig,
        private toastrQueueService: ToastrQueueService,
        private webWorkerService: WebWorkerService,
        private authService: AuthService,
        private navigation: NavigationService,
        private resource: LogoutResourceService,
        private logoutProvidersService: LogoutProvidersService,
        private currentSessionConfig: CurrentSessionConfig,
        @Inject(ON_LOGOUT_PROVIDER) private logoutProviders: OnLogoutProvider[],
    ) {}

    async onFeatureInit() {
        await Promise.all([firstValueFrom(this.logoutConfig.whenReady), firstValueFrom(this.currentSessionConfig.whenReady)]);

        this.logoutProvidersService.registerProviders(this.logoutProviders);
        this.rtmsService.messages.pipe(filter((m: RtmsMessage) => m.type === RtmsType.AUTO_LOGOUT_EVENT)).subscribe((message: RtmsMessage) => {
            if (message.payload.serviceSessionId === this.user.claims.get(ClaimType.SessionToken)) {
                this.authService.logout();
            }
        });

        this.scheduleAutoLogout();

        this.user.events.pipe(filter((e: UserEvent) => e instanceof UserLogoutEvent)).subscribe(() => {
            if (
                this.logoutConfig.logoutMessage &&
                !(this.logoutConfig.logoutMessage === LogoutMessageType.LOGOUT_MESSAGE_SESSION_SUMMARY && !this.resource.logoutPlaceholders)
            ) {
                this.toastrQueueService.add(this.logoutConfig.logoutMessage, {
                    schedule: ToastrSchedule.AfterNextNavigation,
                    placeholders: this.resource.logoutPlaceholders,
                });
            }
        });

        this.user.events.pipe(filter((e: UserEvent) => e instanceof UserAutologoutEvent)).subscribe(() => {
            this.authService.logout({ redirectAfterLogout: false, isAutoLogout: true }).then(() => {
                this.navigation.goTo('/logout', { forceReload: true, appendReferrer: true });
            });
        });

        this.user.events.pipe(filter((e: UserEvent) => e instanceof UserAutologout24HoursEvent)).subscribe(() => {
            this.navigation.goTo('/logout?logout24hours=true', { forceReload: true, appendReferrer: true });
        });
    }

    private scheduleAutoLogout() {
        this.webWorkerService.removeWorker(WorkerType.AutoLogoutTimeout);

        if (this.currentSessionConfig.remainingLoginTime != null) {
            this.webWorkerService.createWorker(WorkerType.AutoLogoutTimeout, { timeout: this.currentSessionConfig.remainingLoginTime }, () => {
                if (this.user.isAuthenticated) {
                    this.user.triggerEvent(new UserAutologoutEvent());
                } else {
                    this.user.events.pipe(filter((e: UserEvent) => e instanceof UserLoginEvent)).subscribe(() => {
                        this.user.triggerEvent(new UserAutologoutEvent());
                    });
                }
            });
        }
    }
}
