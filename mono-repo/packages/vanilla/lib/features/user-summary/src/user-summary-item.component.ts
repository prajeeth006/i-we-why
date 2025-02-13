import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Injector, OnInit, Signal, inject, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { CurrencyPipe, DslService, MenuContentItem } from '@frontend/vanilla/core';
import { of } from 'rxjs';

@Component({
    standalone: true,
    imports: [CommonModule, CurrencyPipe],
    selector: 'vn-user-summary-item',
    templateUrl: 'user-summary-item.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserSummaryItemComponent implements OnInit {
    summary = input.required<MenuContentItem>();
    private injector = inject(Injector);
    private dslService = inject(DslService);

    summaryValue: Signal<number | undefined>;

    ngOnInit() {
        const formula = this.summary().parameters?.['formula'];

        const summaryValue$ = formula ? this.dslService.evaluateExpression<number>(formula) : of(undefined);
        this.summaryValue = toSignal<number | undefined>(summaryValue$, { injector: this.injector });
    }
}
