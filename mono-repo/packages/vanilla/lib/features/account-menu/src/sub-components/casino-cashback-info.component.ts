import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { TrustAsHtmlPipe } from '@frontend/vanilla/shared/browser';

import { DonutChartComponent } from '../chart/donut-chart.component';
import { CasinoCashbackBaseComponent } from './casino-cashback-base.component';

@Component({
    standalone: true,
    imports: [CommonModule, DonutChartComponent, TrustAsHtmlPipe],
    selector: 'vn-am-casino-cashback-info',
    templateUrl: 'cashback-info.html',
})
export class CasinoCashbackInfoComponent extends CasinoCashbackBaseComponent {
    constructor() {
        super();
    }
}
