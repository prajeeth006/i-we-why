import { ChangeDetectionStrategy, Component, EventEmitter, HostBinding, Input, Output, ViewEncapsulation, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { CommonMessages } from '@frontend/vanilla/core';
import { NgbDate, NgbDateStruct, NgbDatepickerI18n, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';

import { DatePickerI18nService } from './datepicker-i18n.service';
import { DateRange } from './datepicker.service';

/**
 * @experimental
 */
@Component({
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NgbDatepickerModule, FormsModule],
    selector: 'vn-datepicker-calendar',
    templateUrl: 'datepicker-calendar.html',
    styles: [
        `
            .vn-dp-day {
                text-align: center;
                padding: 0.185rem 0.25rem;
                display: inline-block;
                height: 2rem;
                width: 2rem;
            }
        `,
    ],
    styleUrls: ['../../../../../themepark/themes/whitelabel/components/date-picker/styles.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [{ provide: NgbDatepickerI18n, useClass: DatePickerI18nService }],
})
export class DatePickerCalendarComponent {
    @HostBinding('attr.class') get class(): string {
        return 'vn-dp-calendar';
    }

    commonMessages = inject(CommonMessages);

    selected: any;
    model: Date | DateRange | null;
    hoveredDate: NgbDate | null = null;

    @Input() startDate: any;
    @Input() endDate: any;
    @Input() saveText: string;
    @Input() rangeEnabled: boolean;
    @Input() dateFormat: string;
    @Input() headerEnabled = true;
    @Input() footerEnabled = true;

    @Output() onDateChangeEvent: EventEmitter<Date | DateRange | null> = new EventEmitter();
    @Output() onDateSelectedEvent: EventEmitter<Date | DateRange | null> = new EventEmitter();
    @Output() onCloseEvent: EventEmitter<void> = new EventEmitter();

    onDateChange(date: NgbDateStruct | null) {
        this.model = this.toModel(date, this.rangeEnabled);
        this.onDateChangeEvent.emit(this.model);

        if (!this.headerEnabled) {
            this.close();
        }

        if (!this.footerEnabled) {
            this.save();
        }
    }

    close() {
        this.onCloseEvent.emit();
    }

    save() {
        this.onDateSelectedEvent.emit(this.model);
        this.onCloseEvent.emit();
    }

    isSelectingRange(date: NgbDate): boolean {
        return !!this.startDate && !this.endDate && !!this.hoveredDate && date.after(this.startDate) && date.before(this.hoveredDate);
    }

    isInsideRange(date: NgbDate): boolean {
        return !!this.endDate && date.after(this.startDate) && date.before(this.endDate);
    }

    private toModel(date: NgbDateStruct | null, rangeEnabled: boolean): Date | DateRange | null {
        const selectedDate = NgbDate.from(date);

        if (!selectedDate) {
            return null;
        }

        let resultDate: Date | DateRange | null = null;

        if (rangeEnabled) {
            if (!this.startDate && !this.endDate) {
                this.startDate = selectedDate;
            } else if (this.startDate && !this.endDate && selectedDate.after(this.startDate)) {
                this.endDate = selectedDate;
            } else {
                this.endDate = null;
                this.startDate = selectedDate;
            }

            if (this.endDate) {
                const start = new Date(this.startDate.year, this.startDate.month - 1, this.startDate.day, 12, 0, 0, 0);
                const end = new Date(this.endDate.year, this.endDate.month - 1, this.endDate.day, 12, 0, 0, 0);
                resultDate = { start: start, end: end };
            }
        } else {
            this.startDate = selectedDate;
            resultDate = new Date(selectedDate.year, selectedDate.month - 1, selectedDate.day, 12, 0, 0, 0);
        }

        return resultDate;
    }
}
