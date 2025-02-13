import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { TrustAsHtmlPipe } from '@frontend/vanilla/shared/browser';

import { DonutChartComponent } from '../../chart/donut-chart.component';
import { PokerCashbackBaseComponent } from '../poker-cashback-base.component';
import { AccountMenuTileComponent } from './tile.component';

@Component({
    standalone: true,
    imports: [CommonModule, AccountMenuTileComponent, DonutChartComponent, TrustAsHtmlPipe],
    selector: 'vn-am-poker-cashback-tile',
    templateUrl: 'cashback-tile.html',
})
export class PokerCashbackTileComponent extends PokerCashbackBaseComponent {
    constructor() {
        super();
    }
}
