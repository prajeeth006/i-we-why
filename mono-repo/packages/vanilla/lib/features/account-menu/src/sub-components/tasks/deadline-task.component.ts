import { CommonModule, formatDate } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';

import { DslService, DynamicHtmlDirective, Page, SwipeDirective } from '@frontend/vanilla/core';
import { IconCustomComponent } from '@frontend/vanilla/features/icons';
import { AccountMenuTaskStatus } from '@frontend/vanilla/shared/account-menu';
import { TrustAsHtmlPipe } from '@frontend/vanilla/shared/browser';
import { toNumber } from 'lodash-es';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AccountMenuTaskBaseComponent } from './task-base.component';

@Component({
    standalone: true,
    imports: [CommonModule, DynamicHtmlDirective, TrustAsHtmlPipe, SwipeDirective, IconCustomComponent],
    selector: 'vn-am-deadline-task',
    templateUrl: 'task.html',
})
export class DeadlineTaskComponent extends AccountMenuTaskBaseComponent implements OnInit, OnDestroy {
    private unsubscribe = new Subject<void>();

    constructor(
        private page: Page,
        private dslService: DslService,
    ) {
        super();
    }

    get countdownField(): string {
        return this.item.parameters['countdown-field']!;
    }

    get countdownThreshold(): number {
        return toNumber(this.item.parameters['countdown-threshold']);
    }

    private static clearTime(date: Date) {
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        date.setMilliseconds(0);
    }

    ngOnInit() {
        this.item.layout = 'deadline';

        if (!this.item.parameters['dsl-countdown-formula']) {
            return;
        }

        this.dslService
            .evaluateExpression<number>(this.item.parameters['dsl-countdown-formula'])
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((daysLeft) => {
                if (isNaN(daysLeft) || isNaN(this.countdownThreshold)) {
                    return;
                }
                daysLeft = Math.floor(daysLeft);

                const isUrgent = daysLeft <= this.countdownThreshold;
                const status = isUrgent ? AccountMenuTaskStatus.URGENT : AccountMenuTaskStatus.PENDING;
                const description = this.getDescription(daysLeft, isUrgent);
                this.refreshItem(daysLeft, status, description);
            });
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    private getDescription(daysLeft: number, isUrgent: boolean): string | undefined {
        if (daysLeft > 0) {
            const now = new Date();

            const endDate = new Date();
            endDate.setDate(now.getDate() + daysLeft);
            DeadlineTaskComponent.clearTime(endDate);

            const formattedEndDate = formatDate(endDate, 'fullDate', this.page.locale);
            const hoursLeft = 23 - now.getHours();
            const timeLeft = hoursLeft ? `${daysLeft - 1}d : ${hoursLeft}h` : `${daysLeft - 1}d`;

            return `${this.resources?.by}: ${formattedEndDate} ${
                isUrgent ? `<span class="ch-task-card__timer font-weight-bold">${timeLeft}</span>` : ''
            }`;
        }

        return;
    }
}
