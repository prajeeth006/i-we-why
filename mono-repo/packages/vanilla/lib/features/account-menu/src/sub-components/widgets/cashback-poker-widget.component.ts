import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { PokerCashbackBaseComponent } from '../poker-cashback-base.component';
import { AccountMenuWidgetComponent } from './widget.component';

@Component({
    standalone: true,
    imports: [CommonModule, AccountMenuWidgetComponent],
    selector: 'vn-am-cashback-poker-widget',
    templateUrl: 'cashback-widget.html',
})
export class CashbackPokerWidgetComponent extends PokerCashbackBaseComponent {
    constructor() {
        super();
    }
}
