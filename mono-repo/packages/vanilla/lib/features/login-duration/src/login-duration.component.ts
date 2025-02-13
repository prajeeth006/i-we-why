import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation, signal } from '@angular/core';

import {
    ClientConfigService,
    ClockService,
    DynamicHtmlDirective,
    DynamicLayoutService,
    HtmlNode,
    SessionStoreKey,
    SessionStoreService,
    TimeFormat,
    TimeSpan,
    UnitFormat,
    UserEvent,
    UserLogoutEvent,
    UserService,
    WebWorkerService,
    WorkerType,
} from '@frontend/vanilla/core';
import { CurrentSessionConfig } from '@frontend/vanilla/shared/current-session';
import { toNumber } from 'lodash-es';
import { filter } from 'rxjs';

import { LoginDurationTrackingService } from './login-duration-tracking.service';
import { LoginDurationConfig } from './login-duration.client-config';

/**
 * @stable
 *
 * Sitecore item: {@link http://cms.prod.env.works/sitecore/DirectLink.aspx?fo={05EB8D98-C673-44BA-8D72-30E2109BCD57}&la=}
 */
@Component({
    standalone: true,
    imports: [CommonModule, DynamicHtmlDirective],
    selector: 'vn-login-duration',
    templateUrl: 'login-duration.html',
    host: { class: 'login-duration-container' },
    styleUrls: ['../../../../../themepark/themes/whitelabel/components/login-duration/styles.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginDurationComponent implements OnInit, OnDestroy {
    readonly message = signal<string | null>(null);
    readonly isDurationTextHidden = signal<boolean>(false);

    private loginTime: number;
    private htmlNodeClassName: string;
    private static instance = 0; // To support multiple instances (e.g. iframe and main app)

    constructor(
        private loginDurationConfig: LoginDurationConfig,
        private userService: UserService,
        private htmlNode: HtmlNode,
        private clientConfig: ClientConfigService,
        private trackingService: LoginDurationTrackingService,
        private sessionStorageService: SessionStoreService,
        private currentSessionConfig: CurrentSessionConfig,
        private dynamicLayoutService: DynamicLayoutService,
        private webWorkerService: WebWorkerService,
        private clockService: ClockService,
        private changeDetectorRef: ChangeDetectorRef,
    ) {
        LoginDurationComponent.instance++;
    }

    async ngOnInit() {
        if (!this.currentSessionConfig.loginDuration) {
            await this.clientConfig.reload([CurrentSessionConfig]);
        }

        this.htmlNodeClassName = `${this.loginDurationConfig.slotName?.toLowerCase() ?? 'custom'}-login-duration-shown`;

        if (this.currentSessionConfig.loginDuration !== null) {
            const clientLoginDuration = toNumber(this.sessionStorageService.get(SessionStoreKey.ClientLoginDuration));
            this.sessionStorageService.remove(SessionStoreKey.ClientLoginDuration);
            this.loginTime = clientLoginDuration ? Date.now() - clientLoginDuration : Date.now() - this.currentSessionConfig.loginDuration;
        }

        this.userService.events.pipe(filter((e: UserEvent) => e instanceof UserLogoutEvent)).subscribe(() => {
            this.sessionStorageService.remove(SessionStoreKey.ClientLoginDuration);
        });

        this.initClock();
    }

    ngOnDestroy() {
        this.message.set(null);
        this.htmlNode.setCssClass(this.htmlNodeClassName, false);
        this.sessionStorageService.set(SessionStoreKey.ClientLoginDuration, Math.floor(Date.now() - this.loginTime));
        this.webWorkerService.removeWorker(WorkerType.LoginDurationInterval + LoginDurationComponent.instance);

        if (!this.userService.isAuthenticated) {
            this.dynamicLayoutService.removeComponent(this.loginDurationConfig.slotName, LoginDurationComponent);
        }
    }

    private initClock() {
        if (!this.userService.isAuthenticated || this.loginTime === null) {
            return;
        }

        this.setMessage();
        this.htmlNode.setCssClass(this.htmlNodeClassName, true);
        this.trackingService.trackLoad(new Date(this.loginTime).toTimeString(), this.loginDurationConfig.slotName || 'custom');

        // TODO: Rework after removing Angular zone
        this.webWorkerService.createWorker(
            WorkerType.LoginDurationInterval + LoginDurationComponent.instance,
            { interval: 1000, runInsideAngularZone: true },
            () => {
                if (this.userService.isAuthenticated) {
                    this.setMessage();
                    this.changeDetectorRef.detectChanges();
                } else {
                    this.ngOnDestroy();
                }
            },
        );
    }

    private setMessage() {
        this.isDurationTextHidden.set(this.loginDurationConfig.text.trim().length <= '{duration}'.length);

        const elapsedTimeSpan = new TimeSpan(Math.floor(Date.now() - this.loginTime));
        const loginDuration = this.clockService.toTotalTimeStringFormat(elapsedTimeSpan, {
            unitFormat: UnitFormat.Hidden,
            hideZeros: false,
            timeFormat: this.loginDurationConfig.timeFormat || TimeFormat.HMS,
        });

        this.message.set(
            this.loginDurationConfig.text.toLowerCase().replace('{duration}', `<span class="login-duration-time">${loginDuration}</span>`),
        );
    }
}
