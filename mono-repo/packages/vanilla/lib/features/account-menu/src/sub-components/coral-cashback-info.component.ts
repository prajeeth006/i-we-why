import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { TrustAsHtmlPipe } from '@frontend/vanilla/shared/browser';

import { DonutChartComponent } from '../chart/donut-chart.component';
import { CoralCashbackBaseComponent } from './coral-cashback-base.component';

@Component({
    standalone: true,
    imports: [CommonModule, DonutChartComponent, TrustAsHtmlPipe],
    selector: 'vn-am-coral-cashback-info',
    templateUrl: 'cashback-info.html',
})
export class CoralCashbackInfoComponent extends CoralCashbackBaseComponent {
    constructor() {
        super();
    }
}
