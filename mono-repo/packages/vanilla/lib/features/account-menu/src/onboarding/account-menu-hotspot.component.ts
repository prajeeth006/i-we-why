import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';

import { DynamicHtmlDirective, EventsService, TrackingService, VanillaEventNames } from '@frontend/vanilla/core';
import { IconCustomComponent } from '@frontend/vanilla/features/icons';
import { PopperContentComponent } from '@frontend/vanilla/features/popper';
import { AccountMenuConfig, AccountMenuOnboardingService } from '@frontend/vanilla/shared/account-menu';
import { NgxFloatUiModule } from 'ngx-float-ui';
import { filter } from 'rxjs/operators';

import { AccountMenuItemBase } from '../account-menu-item-base';

@Component({
    standalone: true,
    imports: [CommonModule, PopperContentComponent, DynamicHtmlDirective, NgxFloatUiModule, IconCustomComponent],
    selector: 'vn-am-hotspot',
    templateUrl: 'account-menu-hotspot.html',
})
export class AccountMenuHotspotComponent extends AccountMenuItemBase implements OnInit {
    @ViewChild(PopperContentComponent, { static: true }) popper: PopperContentComponent;

    get hotspotComponentEnabled(): boolean {
        return (
            (this.version === 3 || this.version === 5) &&
            this.accountMenuOnboardingService.tourStartedLoginCount !== undefined &&
            this.content.account.onboarding.showAccountMenuHotspotLoginCount >= this.accountMenuOnboardingService.tourStartedLoginCount
        );
    }

    constructor(
        eventsService: EventsService,
        public content: AccountMenuConfig,
        private accountMenuOnboardingService: AccountMenuOnboardingService,
        private trackingService: TrackingService,
    ) {
        super();
        eventsService.events.pipe(filter((e) => e?.eventName === VanillaEventNames.OpenOnboardingTour)).subscribe(() => {
            this.popper?.close();
        });
    }

    ngOnInit() {
        if (this.hotspotComponentEnabled) {
            this.trackingService.triggerEvent('Event.Tracking', {
                'component.CategoryEvent': 'my profile',
                'component.LabelEvent': 'my hub',
                'component.ActionEvent': 'load',
                'component.PositionEvent': 'not applicable',
                'component.LocationEvent': 'account page',
                'component.EventDetails': 'account page hotspot',
                'component.URLClicked': 'not applicable',
            });
        }
    }

    hotspotClicked() {
        this.trackingService.triggerEvent('Event.Tracking', {
            'component.CategoryEvent': 'my profile',
            'component.LabelEvent': 'my hub',
            'component.ActionEvent': 'click',
            'component.PositionEvent': 'not applicable',
            'component.LocationEvent': 'account page',
            'component.EventDetails': 'account page hotspot',
            'component.URLClicked': 'not applicable',
        });

        this.trackingService.triggerEvent('Event.Tracking', {
            'component.CategoryEvent': 'my profile',
            'component.LabelEvent': 'my hub',
            'component.ActionEvent': 'load',
            'component.PositionEvent': 'account page hotspot',
            'component.LocationEvent': 'onboarding hotspot popup',
            'component.EventDetails': 'onboarding hotspot popup',
            'component.URLClicked': 'not applicable',
        });
    }
}
