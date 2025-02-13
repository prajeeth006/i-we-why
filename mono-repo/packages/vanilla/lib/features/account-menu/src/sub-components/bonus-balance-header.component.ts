import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { DynamicComponentDirective, MenuContentItem } from '@frontend/vanilla/core';
import { BonusBalanceService } from '@frontend/vanilla/features/bonus-balance';

import { AccountMenuItemBase } from '../account-menu-item-base';

@Component({
    standalone: true,
    imports: [CommonModule, DynamicComponentDirective],
    selector: 'vn-bonus-balance-header',
    templateUrl: './bonus-balance-header.component.html',
})
export class BonusBalanceHeaderComponent extends AccountMenuItemBase implements OnInit {
    balanceItems: MenuContentItem[];
    ctaItems: MenuContentItem[];

    constructor(private bonusBalanceService: BonusBalanceService) {
        super();
    }

    ngOnInit() {
        this.bonusBalanceService.refresh();

        if (this.item.children) {
            this.balanceItems = this.item.children.filter((x) => x.type !== 'cta');
            this.ctaItems = this.item.children.filter((x) => x.type === 'cta');
        }
    }
}
