import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { CurrencyPipe, DslService } from '@frontend/vanilla/core';
import { Observable } from 'rxjs';

import { AccountMenuItemBase } from '../../account-menu-item-base';

@Component({
    standalone: true,
    imports: [CommonModule, CurrencyPipe],
    selector: 'vn-am-balance-tile-item',
    templateUrl: 'balance-tile-item.html',
})
export class BalanceTileItemComponent extends AccountMenuItemBase implements OnInit {
    balance: Observable<number>;

    constructor(public dslService: DslService) {
        super();
    }

    ngOnInit() {
        this.balance = this.dslService.evaluateExpression(this.item.parameters['balance']!);
    }
}
