import { OverlayModule, OverlayRef } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, DestroyRef, Injector, OnDestroy, OnInit, ViewEncapsulation, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import {
    AuthService,
    ClaimType,
    ClockService,
    EventsService,
    LoginDialogService,
    LoginMessageKey,
    LoginNavigationService,
    NativeAppService,
    NativeEventType,
    NavigationService,
    RouteDataOptions,
    TimeFormat,
    TimeSpan,
    UnitFormat,
    UserService,
    WINDOW,
    WebWorkerService,
    WindowEvent,
    WorkerType,
} from '@frontend/vanilla/core';
import { FormatPipe, TrustAsHtmlPipe } from '@frontend/vanilla/shared/browser';
import { DialogComponent } from '@frontend/vanilla/shared/dialog';
import { padStart, startCase } from 'lodash-es';
import { first } from 'rxjs';

import { InactivityScreenOverlayService } from './inactivity-screen-overlay.service';
import { InactivityScreenTrackingService } from './inactivity-screen-tracking.service';
import { InactivityScreenConfig } from './inactivity-screen.client-config';
import { InactivityLogoutOptions, InactivityMode, WebVersion } from './inactivity-screen.models';
import { InactivityScreenService } from './inactivity-screen.service';

@Component({
    standalone: true,
    imports: [CommonModule, TrustAsHtmlPipe, FormatPipe, OverlayModule, DialogComponent],
    selector: 'vn-inactivity-screen-overlay',
    templateUrl: 'inactivity-screen-overlay.html',
    styleUrls: ['../../../../../themepark/themes/whitelabel/components/web-inactivity-screen/styles.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class InactivityScreenOverlayComponent implements OnInit, OnDestroy {
    text: string | undefined;
    mode: InactivityMode;
    messages: { [attr: string]: string };
    boxedTimer: boolean;
    currentCountdown: number = this.config.countdownTimeout;
    percentageElapsed = signal<number>(100);
    isWebVersion2 = signal<boolean>(this.config.webVersion === WebVersion.Version2);
    readonly countdown = signal<string>('');
    readonly InactivityMode = InactivityMode;
    readonly TimeSpan = TimeSpan;

    private isAuthRoute: boolean;
    private isWebMode: boolean;
    private logoutOptions: InactivityLogoutOptions;
    private inactivityScreenOverlayService: InactivityScreenOverlayService;
    readonly #window = inject(WINDOW);

    constructor(
        public config: InactivityScreenConfig,
        private inactivityScreenService: InactivityScreenService,
        private authService: AuthService,
        private eventsService: EventsService,
        private nativeAppService: NativeAppService,
        private loginDialogService: LoginDialogService,
        private tracking: InactivityScreenTrackingService,
        private navigationService: NavigationService,
        private loginNavigationService: LoginNavigationService,
        private webWorkerService: WebWorkerService,
        private user: UserService,
        private clockService: ClockService,
        private overlayRef: OverlayRef,
        private destroyRef: DestroyRef,
        private changeDetectorRef: ChangeDetectorRef,
        private injector: Injector,
    ) {
        /*
         * InactivityScreenOverlayService imports InactivityScreenOverlayComponent and vice versa
         * To break this cyclic usage we use the injector to get the service instance
         * */
        this.inactivityScreenOverlayService = this.injector.get(InactivityScreenOverlayService);
    }

    async ngOnInit() {
        this.mode = startCase(this.config.mode) as InactivityMode;
        this.isWebMode = this.mode === InactivityMode.Web;
        this.logoutOptions = {
            closeOverlay: this.isWebMode,
            showLoginDialog: this.isWebMode,
            redirectAfterLogout: false,
        };
        this.messages = this.config.overlay?.messages || this.config.resources.messages;
        this.text = this.messages[`Overlay_Text_${this.mode}`];

        if (this.text && this.text.indexOf('{MINUTES}') > -1) {
            this.boxedTimer = true;
            this.text = this.text.replace('{MINUTES}', this.padStart(Math.floor(this.config.idleTimeout / 60000) % 60));
        }

        this.inactivityScreenService.activity.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.continue());
        this.navigationService.routeData.pipe(first()).subscribe((routeDataOptions: RouteDataOptions | null) => {
            this.isAuthRoute = routeDataOptions?.authorized || routeDataOptions?.allowAnonymous === false;
        });

        if (this.#window.document.hidden) {
            this.initializeTimeoutWorker();
        } else {
            await this.initializeCountdown();
        }

        this.#window.addEventListener(WindowEvent.VisibilityChange, this.visibilityChangeEventHandler, false);
        this.tracking.trackShowOverlay(this.currentCountdown, this.mode);
    }

    ngOnDestroy() {
        this.webWorkerService.removeWorker(WorkerType.InactivityScreenInterval);
        this.#window.removeEventListener(WindowEvent.VisibilityChange, this.visibilityChangeEventHandler, false);
        this.webWorkerService.removeWorker(WorkerType.InactivityScreenTimeout);
    }

    async continue(event?: Event) {
        if (event) {
            event.stopPropagation();
        }

        this.webWorkerService.removeWorker(WorkerType.InactivityScreenInterval);
        this.overlayRef.detach();

        if (this.mode === InactivityMode.Betstation) {
            this.tracking.trackClick(this.countdown());
        }

        if (this.isWebMode) {
            this.tracking.trackContinue();
            if (this.config.prolongSession && this.user.isAuthenticated) {
                await this.authService.ping();
            }
        }
    }

    async logout(event?: MouseEvent) {
        event?.stopPropagation();

        this.webWorkerService.removeWorker(WorkerType.InactivityScreenInterval);
        this.logoutOptions.isManualLogout = !!event;
        this.logoutOptions.redirectAfterLogout = this.isWebVersion2();

        if (this.logoutOptions.closeOverlay) {
            this.overlayRef.detach();
        }

        // Electron asked not to logout anonymous user, just to send reset terminal event.
        if (this.user.isAnonymous) {
            if (this.mode === InactivityMode.Betstation) {
                this.tracking.trackSession(this.user.claims.get(ClaimType.SessionToken));
            }

            this.eventsService.raise({ eventName: NativeEventType.RESET_TERMINAL });
            this.nativeAppService.sendToNative({ eventName: NativeEventType.RESET_TERMINAL });
        } else if (this.user.isAuthenticated) {
            if (this.logoutOptions.isManualLogout) {
                await this.tracking.trackLogout();
            }

            await this.authService.logout(this.logoutOptions);
            this.eventsService.raise({ eventName: NativeEventType.RESET_TERMINAL });

            if (!this.logoutOptions.redirectAfterLogout) {
                if (this.config.enableSessionPopup && this.isWebMode) {
                    this.tracking.trackSessionOverlay();
                    this.inactivityScreenOverlayService.showSessionOverlay();
                } else if (this.isAuthRoute || this.logoutOptions.isManualLogout) {
                    await this.loginNavigationService.goToLogin({
                        loginMessageKey: LoginMessageKey.Inactivity,
                        forceReload: !this.config.enableSessionPopup,
                    });
                } else if (this.logoutOptions.showLoginDialog) {
                    this.loginDialogService.open({
                        loginMessageKey: LoginMessageKey.Inactivity,
                        openedBy: LoginMessageKey.Inactivity,
                    });
                }
            }
        }
    }

    private async initializeCountdown() {
        if (this.currentCountdown <= 0) {
            await this.logout();
        } else {
            this.updateCountdown();

            this.webWorkerService.createWorker(WorkerType.InactivityScreenInterval, { interval: 1000, runInsideAngularZone: true }, () => {
                this.currentCountdown--;
                this.updateCountdown();
                this.changeDetectorRef.detectChanges();

                if (this.currentCountdown <= 0) {
                    this.logout();
                }
            });
        }
    }

    private initializeTimeoutWorker() {
        this.webWorkerService.createWorker(
            WorkerType.InactivityScreenTimeout,
            {
                timeout: this.currentCountdown * 1000,
                runInsideAngularZone: true,
            },
            () => this.logout(),
        );
    }

    private updateCountdown() {
        this.countdown.set(
            this.clockService.toTotalTimeStringFormat(TimeSpan.fromSeconds(this.currentCountdown), {
                timeFormat: TimeFormat.MS,
                hideZeros: false,
                unitFormat: UnitFormat.Hidden,
            }),
        );
        if (this.isWebVersion2()) {
            this.percentageElapsed.set((this.currentCountdown / this.config.countdownTimeout) * 100);
        }
    }

    private padStart(x: number): string {
        return padStart(x.toString(), 2, '0');
    }

    private visibilityChangeEventHandler = async () => {
        this.webWorkerService.removeWorker(WorkerType.InactivityScreenInterval);

        if (this.#window.document.hidden) {
            this.initializeTimeoutWorker();
        } else {
            this.currentCountdown -= this.webWorkerService.removeWorker(WorkerType.InactivityScreenTimeout);
            await this.initializeCountdown();
        }
    };
}
