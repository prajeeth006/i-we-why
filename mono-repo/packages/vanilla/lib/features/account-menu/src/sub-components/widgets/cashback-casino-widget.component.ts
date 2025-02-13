import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { CasinoCashbackBaseComponent } from '../casino-cashback-base.component';
import { AccountMenuWidgetComponent } from './widget.component';

@Component({
    standalone: true,
    imports: [CommonModule, AccountMenuWidgetComponent],
    selector: 'vn-am-cashback-casino-widget',
    templateUrl: 'cashback-widget.html',
})
export class CashbackCasinoWidgetComponent extends CasinoCashbackBaseComponent {
    constructor() {
        super();
    }
}
