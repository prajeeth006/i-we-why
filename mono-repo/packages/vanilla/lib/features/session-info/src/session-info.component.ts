import { OverlayRef } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, computed, input, signal } from '@angular/core';

import {
    ClockService,
    DynamicHtmlDirective,
    IntlService,
    MessageQueueService,
    MessageScope,
    TimeFormat,
    TimeSpan,
    TrackingService,
    UnitFormat,
    UserService,
} from '@frontend/vanilla/core';
import { MessagePanelComponent } from '@frontend/vanilla/features/message-panel';
import { ImageComponent } from '@frontend/vanilla/shared/image';

import { SessionInfoResourceService } from './session-info-resource.service';
import { SessionInfoConfig } from './session-info.client-config';
import { SessionInfo } from './session-info.models';

@Component({
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, DynamicHtmlDirective, MessagePanelComponent, ImageComponent],
    selector: 'lh-session-info',
    templateUrl: 'session-info.html',
})
export class SessionInfoComponent implements OnInit {
    sessionInfo = input.required<SessionInfo>();
    MessageScope = MessageScope;
    config = signal<SessionInfoConfig>(this.sessionInfoConfig);
    content = computed(() => this.config().content);
    totalWager = computed(() => {
        const totalWagerWithCurrency = this.getCurrencyValue(this.sessionInfo().totalWagerAmt);

        return this.content().resources.TotalWager?.replace(/{TOTAL_WAGER}/g, totalWagerWithCurrency) || '';
    });
    winningsLosses = computed(() => {
        this.trackingEventText = `Reality Check Pop-Up with ${this.sessionInfo().balance < 0 ? 'losses' : 'winnings'}`;
        this.trackWinningLosses(`${this.trackingEventText} - Displayed`);

        const winningsWithCurrency = this.getCurrencyValue(this.sessionInfo().balance);

        return this.content().resources.WinningsLosses?.replace(/{WINNINGS_LOSSES}/g, winningsWithCurrency) || '';
    });
    loginDuration = computed(() => {
        const elapsedTimeSpan = new TimeSpan(this.sessionInfo().elapsedTime);

        const loginDuration = this.clockService.toTotalTimeStringFormat(elapsedTimeSpan, {
            timeFormat: <TimeFormat>this.content().parameters?.timeFormat || TimeFormat.HM,
            hideZeros: !!this.content().parameters?.hideZeros,
            unitFormat: UnitFormat.Hidden,
        });

        return (
            this.content().resources.LoginDuration?.replace(
                /{LOGIN_DURATION}/g,
                `${loginDuration} ${Math.floor(elapsedTimeSpan.totalHours) > 0 ? this.content().resources.Hours : this.content().resources.Minutes}`,
            ) || ''
        );
    });

    private trackingEventText: string;

    constructor(
        private sessionInfoConfig: SessionInfoConfig,
        private userService: UserService,
        private sessionInfoResourceService: SessionInfoResourceService,
        private overlayRef: OverlayRef,
        private messageQueueService: MessageQueueService,
        private intlService: IntlService,
        private clockService: ClockService,
        private trackingService: TrackingService,
    ) {}

    ngOnInit() {
        this.messageQueueService.clear({ scope: MessageScope.SessionInfo, clearPersistent: false });
    }

    close() {
        this.trackWinningLosses('Continue CTA - Click');

        if (this.userService.isAuthenticated) {
            this.sessionInfoResourceService
                .rcpuContinue()
                .then(() => this.overlayRef.detach())
                .catch(() => this.overlayRef.detach());
        } else {
            this.overlayRef.detach();
        }
    }

    logout() {
        this.trackWinningLosses('Logout CTA - Click');

        if (this.userService.isAuthenticated) {
            this.sessionInfoResourceService
                .rcpuQuit()
                .then(() => this.overlayRef.detach())
                .catch(() => this.overlayRef.detach());
        } else {
            this.overlayRef.detach();
        }
    }

    private getCurrencyValue(value?: number): string {
        const valueInMainCurrency = (value || 0) / 100;

        return this.intlService.formatCurrency(valueInMainCurrency);
    }

    private trackWinningLosses(actionEvent: String) {
        this.trackingService.triggerEvent('Event.Clicks', {
            'component.CategoryEvent': 'Reality Check Pop-Up',
            'component.LabelEvent': this.trackingEventText,
            'component.ActionEvent': actionEvent,
            'component.PositionEvent': 'not applicable',
            'component.LocationEvent': this.trackingEventText || 'not applicable',
        });
    }
}
