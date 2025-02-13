import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { DsButton } from '@frontend/ui/button';
import { DsPill } from '@frontend/ui/pill';
import { DatePickerComponent } from '@frontend/vanilla/features/datepicker';
import { TrustAsHtmlPipe } from '@frontend/vanilla/shared/browser';
import { DialogComponent } from '@frontend/vanilla/shared/dialog';
import { FormFieldComponent } from '@frontend/vanilla/shared/forms';
import { NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { firstValueFrom } from 'rxjs';

import { RangeDatepickerConfig } from './range-datepicker.client-config';
import { DateRange, RangeDatepickerOptions } from './range-datepicker.models';
import { RangeDatepickerService } from './range-datepicker.service';

/**
 * @stable
 */
@Component({
    standalone: true,
    selector: 'vn-range-datepicker-overlay',
    templateUrl: 'range-datepicker-overlay.html',
    styleUrls: ['../../../../../themepark/themes/whitelabel/components/date-picker/styles.scss'],
    encapsulation: ViewEncapsulation.None,
    imports: [CommonModule, DialogComponent, TrustAsHtmlPipe, DatePickerComponent, FormsModule, FormFieldComponent, DsPill, DsButton],
})
export class RangeDatepickerOverlayComponent implements OnInit {
    @Input() options: RangeDatepickerOptions | undefined;
    @Output() apply = new EventEmitter<DateRange | null>();
    @Output() clear = new EventEmitter<void>();
    @Output() close = new EventEmitter<void>();

    readonly config = signal<RangeDatepickerConfig | undefined>(undefined);
    readonly datepickerConfig = signal<NgbDatepickerConfig | undefined>(undefined);
    readonly selectedRange = signal<string>('');

    dateRange: DateRange;

    private rangeDatepickerConfig = inject(RangeDatepickerConfig);
    private rangeDatepickerService = inject(RangeDatepickerService);

    async ngOnInit() {
        await firstValueFrom(this.rangeDatepickerConfig.whenReady);

        this.config.set(this.rangeDatepickerConfig);

        if (!this.options?.datepickerConfig) {
            const ngbConfig = new NgbDatepickerConfig();
            ngbConfig.firstDayOfWeek = this.rangeDatepickerConfig.firstDayOfWeek;
            this.options = { datepickerConfig: ngbConfig };
        } else if (!this.options?.datepickerConfig?.firstDayOfWeek) {
            this.options.datepickerConfig.firstDayOfWeek = this.rangeDatepickerConfig.firstDayOfWeek;
        }

        this.datepickerConfig.set(this.options?.datepickerConfig);

        const defaultRange = this.rangeDatepickerConfig.templates.content?.form.periodselectionform?.htmlAttributes?.default;

        if (this.options?.dateRange) {
            this.dateRange = this.options.dateRange;
        } else if (defaultRange) {
            this.setDateRange(defaultRange);
        }
    }

    setDateRange(range: string) {
        const end = new Date();

        this.dateRange = {
            start: new Date(),
            end: new Date(end.setDate(end.getDate() + Number(range))),
        };

        this.selectedRange.set(range);
    }

    setStartDate(start: Date) {
        this.dateRange = {
            ...this.dateRange,
            start,
        };
    }

    setEndDate(end: Date) {
        this.dateRange = {
            ...this.dateRange,
            end,
        };
    }

    onApply() {
        this.apply.emit(this.dateRange);
        this.rangeDatepickerService.apply(this.dateRange);
    }

    onClear() {
        this.dateRange = {
            start: null,
            end: null,
        };
        this.clear.emit();
        this.selectedRange.set('');
    }

    onClose() {
        this.close.emit();
        this.rangeDatepickerService.close();
    }
}
