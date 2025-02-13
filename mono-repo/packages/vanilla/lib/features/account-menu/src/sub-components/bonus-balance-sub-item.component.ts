import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { CurrencyPipe, DslService, TrackingService, toBoolean } from '@frontend/vanilla/core';
import { IconCustomComponent } from '@frontend/vanilla/features/icons';

import { AccountMenuItemBase } from '../account-menu-item-base';

@Component({
    standalone: true,
    imports: [CommonModule, CurrencyPipe, IconCustomComponent],
    selector: 'vn-bonus-balance-sub-item',
    templateUrl: './bonus-balance-sub-item.component.html',
})
export class BonusBalanceSubItemComponent extends AccountMenuItemBase implements OnInit {
    balance: number;
    hideIfZero: boolean;
    constructor(
        public dslService: DslService,
        private trackingService: TrackingService,
    ) {
        super();
    }

    ngOnInit(): void {
        this.trackingService.triggerEvent('contentView', {
            'component.CategoryEvent': 'mini menu',
            'component.LabelEvent': 'my bonuses',
            'component.ActionEvent': 'load',
            'component.PositionEvent': 'bonus and rewards',
            'component.LocationEvent': 'wallet',
            'component.EventDetails': this.item.text,
            'component.URLClicked': 'not applicable',
        });
        this.dslService.evaluateExpression<number>(this.item.parameters['formula']!).subscribe((x) => (this.balance = x));
        this.hideIfZero = !!toBoolean(this.item.parameters['hide-if-zero']);
    }
}
