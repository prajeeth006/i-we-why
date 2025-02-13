import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { DynamicComponentDirective } from '@frontend/vanilla/core';
import { TooltipsComponent, TooltipsConfig, TooltipsService } from '@frontend/vanilla/shared/tooltips';
import { first } from 'rxjs';

import { BalanceBreakdownItemBase } from '../balance-breakdown-item-base';
import { BalanceBreakdownTrackingService } from '../balance-breakdown-tracking.service';

@Component({
    standalone: true,
    imports: [CommonModule, DynamicComponentDirective, TooltipsComponent],
    selector: 'vn-bb-tutorial',
    templateUrl: 'tutorial-layout.component.html',
    styleUrls: ['../../../../../../themepark/themes/whitelabel/components/balance-breakdown/bb-tutorial-layout/styles.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class BalanceBreakdownTutorialLayoutComponent extends BalanceBreakdownItemBase implements OnInit {
    tutorialItem: string;
    active: boolean;
    isTutorialTooltipsEnabled: boolean;
    tutorials: any;

    constructor(
        public tooltipService: TooltipsService,
        private tooltipsConfig: TooltipsConfig,
        private balanceTrackingService: BalanceBreakdownTrackingService,
    ) {
        super();
    }

    ngOnInit() {
        this.tooltipsConfig.whenReady.pipe(first()).subscribe(() => {
            this.isTutorialTooltipsEnabled = this.tooltipsConfig.isTutorialTooltipsEnabled;
            this.tutorials = this.tooltipsConfig.tutorials;
        });
        this.tutorialItem = this.item.parameters['tooltip-tutorial']!;

        this.tooltipService.activeTooltip.subscribe((tp) => {
            this.active = tp?.name == this.tutorialItem && tp.isActive;
        });
    }

    nextClick() {
        this.balanceTrackingService.trackTutorialNavigation(this.tutorialItem, 'next tip');
    }

    previousClick() {
        this.balanceTrackingService.trackTutorialNavigation(this.tutorialItem, 'previous tip');
    }
}
