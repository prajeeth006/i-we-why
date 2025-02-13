import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

import { IntlService } from '@frontend/vanilla/core';
import { IconCustomComponent } from '@frontend/vanilla/features/icons';
import { TrustAsHtmlPipe } from '@frontend/vanilla/shared/browser';
import { toNumber } from 'lodash-es';

import { AccountMenuItemBase } from '../../account-menu-item-base';
import { ProfitLoss } from '../../account-menu.models';

@Component({
    standalone: true,
    imports: [TrustAsHtmlPipe, IconCustomComponent, CommonModule],
    selector: 'vn-profit-loss-feedback',
    templateUrl: './feedback.html',
})
export class ProfitLossFeedbackComponent extends AccountMenuItemBase implements OnInit {
    @Input() data: ProfitLoss;
    description: string = '';
    isPathological: boolean;

    constructor(private intlService: IntlService) {
        super();
    }

    ngOnInit(): void {
        const range = toNumber(this.item.parameters['range-in-days']);
        const rangeText = this.item.resources.RangeText?.replace('_RANGE_', range.toString()) || '';
        const balance = this.data.totalReturn - this.data.totalStake;

        let avgLoss = 0;
        switch (range) {
            case 30:
                avgLoss = this.data.monthlyAverage;
                break;
            case 365:
                avgLoss = this.data.yearlyAverage;
                break;
            default:
                avgLoss = this.data.weeklyAverage;
        }

        if (avgLoss) {
            if (balance < 0) {
                this.isPathological = Math.abs(balance) >= avgLoss;
            }

            let description = this.isPathological
                ? this.item.resources[`PathologicalDescription${range}Days`]
                : this.item.resources[`GeneralDescription${range}Days`];

            const avgLossCurrency = this.intlService.formatCurrency(avgLoss);
            this.description = description?.replace('_RANGE_TEXT_', rangeText).replace('_LOSS_', avgLossCurrency) || '';

            if (this.isPathological) {
                let lossPercentage = ((Math.abs(balance) - avgLoss) * 100) / avgLoss;
                if (lossPercentage > 100) {
                    lossPercentage = lossPercentage / 100;
                    this.description = this.description.replace(
                        '_LOSS-PER_',
                        `${this.getAmountText(lossPercentage)} ${this.item.resources?.TimesText} `,
                    );
                } else {
                    this.description = this.description.replace('_LOSS-PER_', `${this.getAmountText(lossPercentage)}%`);
                }
            }
        }
    }

    getAmountText(amount: number): string {
        let perText = amount.toFixed(2).replace(/0+$/, '');
        perText = perText.charAt(perText.length - 1) === '.' ? perText.substring(0, perText.length - 1) : perText;
        return perText;
    }

    click(e: Event) {
        e.stopPropagation();
    }
}
