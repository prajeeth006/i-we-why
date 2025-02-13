import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { DslService, DynamicComponentDirective } from '@frontend/vanilla/core';
import { BalancePropertiesService } from '@frontend/vanilla/features/balance-properties';
import { toNumber } from 'lodash-es';
import { combineLatest } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';

import { AccountMenuItemBase } from '../../account-menu-item-base';
import { DonutChartComponent, DonutChartSegmentInput } from '../../chart/donut-chart.component';
import { AccountMenuTileComponent } from './tile.component';

@Component({
    standalone: true,
    imports: [CommonModule, AccountMenuTileComponent, DonutChartComponent, DynamicComponentDirective],
    selector: 'vn-am-balance-tile',
    templateUrl: 'balance-tile.html',
})
export class BalanceTileComponent extends AccountMenuItemBase implements OnInit {
    chartSegments: DonutChartSegmentInput[] = [];

    constructor(
        private dslService: DslService,
        private balancePropertiesService: BalancePropertiesService,
    ) {
        super();
    }

    ngOnInit() {
        const main = this.item.children.find((c) => c.name === 'mainbalance');
        if (!main) {
            return;
        }

        this.balancePropertiesService.balanceProperties
            .pipe(
                switchMap(() => this.dslService.evaluateExpression<number>(main.parameters['balance']!)),
                filter((mainBalance) => mainBalance > 0),
                switchMap((mainBalance) =>
                    combineLatest(
                        this.item.children
                            .filter((c) => c.parameters['chart-segment']!)
                            .map((c) => {
                                return {
                                    order: toNumber(c.parameters['chart-segment']!),
                                    formula: c.parameters['balance']!,
                                    name: c.name,
                                };
                            })
                            .sort((a, b) => (a.order > b.order ? 1 : -1))
                            .map((c) =>
                                this.dslService.evaluateExpression<number>(c.formula).pipe(
                                    map((amount) => {
                                        const percent = (100 / mainBalance) * amount;
                                        return {
                                            class: c.name,
                                            percent,
                                        };
                                    }),
                                ),
                            ),
                    ),
                ),
            )
            .subscribe((segments) => (this.chartSegments = segments));
    }
}
