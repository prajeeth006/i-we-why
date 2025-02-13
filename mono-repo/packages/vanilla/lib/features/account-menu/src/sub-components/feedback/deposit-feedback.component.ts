import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { IntlService } from '@frontend/vanilla/core';
import { IconCustomComponent } from '@frontend/vanilla/features/icons';
import { TrustAsHtmlPipe } from '@frontend/vanilla/shared/browser';
import { toNumber } from 'lodash-es';

import { AccountMenuItemBase } from '../../account-menu-item-base';
import { AccountMenuResourceService } from '../../account-menu-resource.service';
import { AverageDeposit } from '../../account-menu.models';

@Component({
    standalone: true,
    selector: 'vn-deposit-feedback',
    templateUrl: './feedback.html',
    imports: [TrustAsHtmlPipe, IconCustomComponent, CommonModule],
})
export class DepositFeedbackComponent extends AccountMenuItemBase implements OnInit {
    description: string = '';
    isPathological: boolean;

    constructor(
        private accountMenuResourceService: AccountMenuResourceService,
        private intlService: IntlService,
    ) {
        super();
    }

    ngOnInit(): void {
        const range = toNumber(this.item.parameters['range-in-days']);
        this.accountMenuResourceService.getAverageDeposit(range).subscribe((d: AverageDeposit) => {
            if (d.labelAverageDepositAmount !== 0 || d.userAverageDepositAmount !== 0) {
                this.isPathological = d.labelAverageDepositAmount <= d.userAverageDepositAmount;
                const rangeText = this.item.resources.RangeText?.replace('_RANGE_', range.toString()) || '';
                const depositAmountCurrency = this.intlService.formatCurrency(d.labelAverageDepositAmount);

                let description = this.isPathological
                    ? this.item.resources[`PathologicalDescription${range}Days`]
                    : this.item.resources[`GeneralDescription${range}Days`];
                this.description = description?.replace('_RANGE_TEXT_', rangeText).replace('_DEPOSIT_', depositAmountCurrency) || '';
            }
        });
    }

    click(e: Event) {
        e.stopPropagation();
    }
}
