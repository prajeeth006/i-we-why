import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { TrustAsHtmlPipe } from '@frontend/vanilla/shared/browser';

import { DonutChartComponent } from '../chart/donut-chart.component';
import { PokerCashbackBaseComponent } from './poker-cashback-base.component';

@Component({
    standalone: true,
    imports: [CommonModule, DonutChartComponent, TrustAsHtmlPipe],
    selector: 'vn-am-poker-cashback-info',
    templateUrl: 'cashback-info.html',
})
export class PokerCashbackInfoComponent extends PokerCashbackBaseComponent {
    constructor() {
        super();
    }
}
