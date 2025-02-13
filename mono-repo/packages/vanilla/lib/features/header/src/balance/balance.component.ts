import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { CurrencyPipe, ElementKeyDirective, SolvePipe, UserService, toBoolean } from '@frontend/vanilla/core';
import { BalancePropertiesService } from '@frontend/vanilla/features/balance-properties';
import { IconCustomComponent } from '@frontend/vanilla/features/icons';

import { HeaderItemBase } from '../header-item-base';
import { HeaderService } from '../header.service';

@Component({
    standalone: true,
    imports: [CommonModule, ElementKeyDirective, CurrencyPipe, SolvePipe, IconCustomComponent],
    selector: 'vn-h-balance',
    templateUrl: 'balance.html',
})
export class BalanceComponent extends HeaderItemBase implements OnInit {
    balanceFormula: string | undefined;
    showArrow: boolean;
    arrowClass: string | undefined;

    constructor(
        public user: UserService,
        public balancePropertiesService: BalancePropertiesService,
        public headerService: HeaderService,
    ) {
        super();
    }

    ngOnInit() {
        if (!this.item.parameters.balance) {
            // Legacy balance formula. Remove when Sitecore items are updated
            this.balanceFormula = this.item.parameters['balance-formula'];
        }

        this.arrowClass = this.item.parameters['arrow-class'] || 'theme-arrow-down';
        this.showArrow = !!toBoolean(this.item.parameters['show-arrow']);
    }
}
