import { Directive, OnDestroy, OnInit } from '@angular/core';

import { Subject } from 'rxjs';

import { AccountMenuItemBase } from '../account-menu-item-base';
import { DonutChartSegmentInput } from '../chart/donut-chart.component';

@Directive()
export class CashbackBaseComponent extends AccountMenuItemBase implements OnInit, OnDestroy {
    isCompleted: boolean;
    text: string;
    additionalText: string;
    description: string;
    chartSegments: DonutChartSegmentInput[];
    cashbackAmount: string;
    minCollection: string;
    left: string;
    ignoreVipLevel: boolean;
    availablePointsTitle: string;
    cashValueTitle: string;
    descriptionV3: string;
    isFirstNotification: boolean = true;
    hideSkeleton: boolean = false;
    unsubscribe = new Subject<void>();

    constructor() {
        super();
    }

    ngOnInit() {
        this.additionalText = this.accountMenuService.resources.messages['CashbackInfoAdditionalText']!;
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }
}
