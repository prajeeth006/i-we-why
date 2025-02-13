import { CommonModule } from '@angular/common';
import { Component, HostBinding, OnInit, Type, ViewEncapsulation } from '@angular/core';

import { DynamicComponentDirective, MenuContentItem, toBoolean, trackByProp } from '@frontend/vanilla/core';
import { BonusBalanceService } from '@frontend/vanilla/features/bonus-balance';
import { NavigationLayoutPageComponent } from '@frontend/vanilla/features/navigation-layout';
import { DslPipe } from '@frontend/vanilla/shared/browser';
import { KycStatusService } from '@frontend/vanilla/shared/kyc';
import { TooltipsConfig, TooltipsService } from '@frontend/vanilla/shared/tooltips';
import { filter, firstValueFrom } from 'rxjs';

import { BalanceBreakdownContent } from './balance-breakdown.client-config';
import { BalanceBreakdownService } from './balance-breakdown.service';

/**
 * @stable
 */
@Component({
    standalone: true,
    imports: [CommonModule, DynamicComponentDirective, DslPipe, NavigationLayoutPageComponent],
    selector: 'vn-balance-breakdown',
    templateUrl: 'balance-breakdown.html',
    styleUrls: ['../../../../../themepark/themes/whitelabel/components/balance-breakdown/styles.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class BalanceBreakdownComponent implements OnInit {
    config: TooltipsConfig;
    isAvailable: boolean;
    readonly trackByText = trackByProp<MenuContentItem>('text');

    @HostBinding() get class(): string {
        return 'navigation-layout-page-card';
    }

    constructor(
        public balanceContent: BalanceBreakdownContent,
        public tooltipsService: TooltipsService,
        private balanceBreakdownService: BalanceBreakdownService,
        private bonusBalanceService: BonusBalanceService,
        private kycStatusService: KycStatusService,
    ) {}

    async ngOnInit() {
        await Promise.all([
            firstValueFrom(this.balanceContent.whenReady),
            firstValueFrom(this.kycStatusService.kycStatus.pipe(filter((e) => e !== null))),
        ]).then(() => {
            this.isAvailable = true;
        });

        // Refresh bonus balance immediately
        this.bonusBalanceService.refresh();
    }

    getItemComponent(type: string): Type<any> | null {
        return this.balanceBreakdownService.getBalanceBreakdownComponent(type);
    }

    visible(item: MenuContentItem): boolean {
        const hideIfSingleProduct = !!toBoolean(item.parameters['hide-if-single-product']);
        const visible = !hideIfSingleProduct || (hideIfSingleProduct && !this.balanceBreakdownService.isSingleProduct());

        if (!visible) {
            this.tooltipsService.removeTooltip(item.parameters['tooltip-tutorial']);
        }

        return visible;
    }
}
