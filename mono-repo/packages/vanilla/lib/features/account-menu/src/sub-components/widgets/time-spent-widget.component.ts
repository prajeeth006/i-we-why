import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { IntlService, TimeSpan, TotalTimePipe, TrackingService, trackByProp } from '@frontend/vanilla/core';
import { FormatPipe } from '@frontend/vanilla/shared/browser';

import { AccountMenuItemBase } from '../../account-menu-item-base';
import { AccountMenuResourceService } from '../../account-menu-resource.service';
import { PercentByProduct, SessionSummary, SessionSummaryType } from '../../account-menu.models';
import { AccountMenuWidgetComponent } from './widget.component';

/**
 * Sitecore: {@link http://cms.prod.env.works/sitecore/DirectLink.aspx?fo={1C705927-3F31-4CBA-861E-FCDEF2652FBD}&la=}
 */
@Component({
    standalone: true,
    imports: [CommonModule, AccountMenuWidgetComponent, TotalTimePipe, FormatPipe],
    selector: 'vn-am-time-spent-widget',
    templateUrl: 'time-spent-widget.html',
})
export class TimeSpentWidgetComponent extends AccountMenuItemBase implements OnInit {
    aggregationTypeText: string;
    activeTimeSpent: TimeSpan;
    percentByProduct: PercentByProduct[];
    isBelowActiveTimeThreshold: boolean;
    hideSkeleton: boolean;
    readonly trackByProduct = trackByProp<PercentByProduct>('product');

    constructor(
        private accountMenuResourceService: AccountMenuResourceService,
        private intlService: IntlService,
        private trackingService: TrackingService,
    ) {
        super();
    }

    ngOnInit() {
        if (!this.item.parameters.aggregationType) {
            return;
        }

        this.accountMenuResourceService.getTimeSpent(<SessionSummaryType>this.item.parameters.aggregationType.toUpperCase()).subscribe({
            next: (summary: SessionSummary) => {
                const currentAverage = summary.sessionSummary?.currentAverage || 0;

                this.aggregationTypeText = this.getAggregationTypeText(summary);
                this.activeTimeSpent = TimeSpan.fromMinutes(this.item.parameters.showAverageTimeSpent ? currentAverage : currentAverage * 7);

                this.isBelowActiveTimeThreshold =
                    this.activeTimeSpent.totalMinutes > 0 &&
                    this.activeTimeSpent.totalMinutes < (Number(this.item.parameters.averagePeriodThresholdInMinutes) || 0);

                this.percentByProduct = this.getPercentByProduct(summary);
                this.trackingService.trackContentItemEvent(this.item.trackEvent, 'LoadedEvent');
                this.hideSkeleton = true;
            },
            error: () => {
                this.hideSkeleton = true;
            },
        });
    }

    private getAggregationTypeText(summary: SessionSummary): string {
        if (this.item.resources.FixedAggregationPeriod) {
            return this.item.resources.FixedAggregationPeriod;
        }

        // TODO: Remove at some point in the future
        if (summary.aggregationType === 'WEEKLY') {
            const months = this.intlService.getMonths();

            const startDate = new Date(summary.startDate);
            const endDate = new Date(summary.endDate);

            while (endDate.getUTCDate() - startDate.getUTCDate() > 6) {
                endDate.setDate(endDate.getDate() - 1);
            }

            const startDateMonth = months[startDate.getUTCMonth()]?.longName;
            const endDateMonth = months[endDate.getUTCMonth()]?.longName;

            const timeInterval =
                startDateMonth === endDateMonth
                    ? `${startDate.getUTCDate()}-${endDate.getUTCDate()} ${endDateMonth}`
                    : `${startDate.getUTCDate()} ${startDateMonth} - ${endDate.getUTCDate()} ${endDateMonth}`;

            return `${this.item.resources.WeekOf} ${timeInterval}`;
        }

        return this.item.resources[summary.aggregationType] || '';
    }

    private getPercentByProduct(summary: SessionSummary): PercentByProduct[] {
        if (!summary.sessionSummary || this.isBelowActiveTimeThreshold) {
            return [];
        }

        const totalTime = Object.values(summary.sessionSummary.productCumulative.active).reduce((a, b) => a + b);

        return Object.entries(summary.sessionSummary.productCumulative.active)
            .filter(([, y]: [string, number]) => y > 0)
            .map<PercentByProduct>(([product, time]) => {
                return {
                    product: this.item.resources[product.toLowerCase()] ?? product,
                    colorClass: this.item.resources[`${product.toLowerCase()}-color-class`] || '',
                    percentage: (time / totalTime) * 100,
                };
            });
    }
}
