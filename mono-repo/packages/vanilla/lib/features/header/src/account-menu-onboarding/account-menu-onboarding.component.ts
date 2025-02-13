import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';

import { DynamicHtmlDirective, EventsService, TrackingService, VanillaEventNames } from '@frontend/vanilla/core';
import { PopperContentComponent } from '@frontend/vanilla/features/popper';
import { AccountMenuOnboardingService } from '@frontend/vanilla/shared/account-menu';
import { NgxFloatUiModule, NgxFloatUiPlacements } from 'ngx-float-ui';
import { filter } from 'rxjs/operators';

import { HeaderItemBase } from '../header-item-base';
import { HeaderConfig } from '../header.client-config';

@Component({
    standalone: true,
    imports: [CommonModule, PopperContentComponent, NgxFloatUiModule, DynamicHtmlDirective],
    selector: 'vn-h-am-onboarding',
    templateUrl: 'account-menu-onboarding.html',
})
export class AccountMenuOnboardingComponent extends HeaderItemBase implements OnInit {
    @ViewChild(PopperContentComponent, { static: true }) popper: PopperContentComponent;

    readonly FloatUiPlacements = NgxFloatUiPlacements;

    get headerComponentEnabled(): boolean {
        return (
            this.config.onboardingEnabled &&
            this.config.hotspotLoginCount >= this.accountMenuOnboardingService.loginCount &&
            this.accountMenuOnboardingService.tourStartedLoginCount === undefined
        );
    }

    get headerPulseEffectEnabled(): boolean {
        return (
            this.config.onboardingEnabled &&
            this.config.pulseEffectLoginCount >= this.accountMenuOnboardingService.loginCount &&
            this.accountMenuOnboardingService.tourStartedLoginCount === undefined &&
            !this.accountMenuOnboardingService.tourDismissed
        );
    }

    constructor(
        eventsService: EventsService,
        public accountMenuOnboardingService: AccountMenuOnboardingService,
        private config: HeaderConfig,
        private trackingService: TrackingService,
    ) {
        super();
        eventsService.events.pipe(filter((e) => e?.eventName === VanillaEventNames.AccountMenuToggle)).subscribe(() => {
            this.popper?.close(true);
        });
    }

    ngOnInit() {
        if (this.headerComponentEnabled) {
            if (this.headerPulseEffectEnabled) {
                this.trackingService.triggerEvent('Event.Tracking', {
                    'component.CategoryEvent': 'my profile',
                    'component.LabelEvent': 'my hub',
                    'component.ActionEvent': 'load',
                    'component.PositionEvent': 'not applicable',
                    'component.LocationEvent': 'avatar icon',
                    'component.EventDetails': 'first login hotspot',
                    'component.URLClicked': 'not applicable',
                });
            } else {
                this.trackingService.triggerEvent('Event.Tracking', {
                    'component.CategoryEvent': 'my profile',
                    'component.LabelEvent': 'my hub',
                    'component.ActionEvent': 'load',
                    'component.PositionEvent': 'not applicable',
                    'component.LocationEvent': 'avatar icon',
                    'component.EventDetails': 'next login hotspot',
                    'component.URLClicked': 'not applicable',
                });
            }
        }
    }

    hotspotClicked() {
        this.trackingService.triggerEvent('Event.Tracking', {
            'component.CategoryEvent': 'my profile',
            'component.LabelEvent': 'my hub',
            'component.ActionEvent': 'click',
            'component.PositionEvent': 'not applicable',
            'component.LocationEvent': 'avatar icon',
            'component.EventDetails': this.accountMenuOnboardingService.isFirstLogin ? 'first login hotspot' : 'next login hotspot',
            'component.URLClicked': 'not applicable',
        });

        this.trackingService.triggerEvent('Event.Tracking', {
            'component.CategoryEvent': 'my profile',
            'component.LabelEvent': 'my hub',
            'component.ActionEvent': 'load',
            'component.PositionEvent': this.accountMenuOnboardingService.isFirstLogin ? 'first login hotspot' : 'next login hotspot',
            'component.LocationEvent': 'onboarding hotspot popup',
            'component.EventDetails': 'onboarding hotspot popup',
            'component.URLClicked': 'not applicable',
        });
    }

    closeClicked(autoClose: boolean) {
        if (!autoClose) {
            this.trackingService.triggerEvent('Event.Tracking', {
                'component.CategoryEvent': 'my profile',
                'component.LabelEvent': 'my hub',
                'component.ActionEvent': 'click',
                'component.PositionEvent': this.accountMenuOnboardingService.isFirstLogin ? 'first login hotspot' : 'next login hotspot',
                'component.LocationEvent': 'onboarding hotspot popup',
                'component.EventDetails': 'dismiss cta',
                'component.URLClicked': 'not applicable',
            });
            this.accountMenuOnboardingService.saveTourDismissed();
        }
    }

    toggleAccountMenu() {
        this.menuActionsService.invoke('toggleAccountMenu', 'header', [undefined, undefined, {}]);

        this.trackingService.triggerEvent('Event.Tracking', {
            'component.CategoryEvent': 'my profile',
            'component.LabelEvent': 'my hub',
            'component.ActionEvent': 'click',
            'component.PositionEvent': 'not applicable',
            'component.LocationEvent': 'not applicable',
            'component.EventDetails': 'show more cta',
            'component.URLClicked': 'not applicable',
        });
    }
}
