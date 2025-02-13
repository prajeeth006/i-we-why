import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { DynamicComponentDirective, MenuContentItem, TimerService } from '@frontend/vanilla/core';
import { IconCustomComponent } from '@frontend/vanilla/features/icons';

import { BalanceBreakdownItemBase } from '../balance-breakdown-item-base';

@Component({
    standalone: true,
    imports: [CommonModule, DynamicComponentDirective, IconCustomComponent],
    selector: 'vn-bb-filtered-layout',
    templateUrl: 'balance-filtered-layout.html',
    styleUrls: ['../../../../../../themepark/themes/whitelabel/components/balance-breakdown/bb-filtered/styles.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class BalanceFilteredItemsLayoutComponent extends BalanceBreakdownItemBase implements OnInit {
    isSingleProduct: boolean;

    get currentSlide(): MenuContentItem | undefined {
        return this.item.children.find((item: MenuContentItem) => item.name == this.balanceBreakdownService.slide()?.name);
    }

    constructor(private timerService: TimerService) {
        super();
    }

    ngOnInit() {
        this.timerService.setTimeout(() => {
            this.isSingleProduct = this.balanceBreakdownService.isSingleProduct();
        });
    }
}
