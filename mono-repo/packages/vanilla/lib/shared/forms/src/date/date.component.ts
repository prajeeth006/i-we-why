import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALIDATORS, NG_VALUE_ACCESSOR, UntypedFormControl, ValidationErrors, Validator } from '@angular/forms';

import { CommonMessages, IntlService, MonthInfo, trackByProp } from '@frontend/vanilla/core';
import { first } from 'rxjs';

import { FormFieldComponent } from '../forms/form-field.component';
import { NumberOnlyDirective } from '../validation/number-only.directive';
import { DateConfig } from './date.client-config';

/**
 * @stable
 */
export class DateModel {
    day: number | null;
    month: number | null;
    year: string | null;
}

/**
 * @whatItDoes Provides day month year picker component and returns javascript Date object
 *
 * @stable
 */
@Component({
    standalone: true,
    imports: [CommonModule, FormsModule, FormFieldComponent, NumberOnlyDirective],
    selector: 'vn-date',
    templateUrl: 'date.html',
    providers: [
        { provide: NG_VALIDATORS, useExisting: DateComponent, multi: true },
        { provide: NG_VALUE_ACCESSOR, useExisting: DateComponent, multi: true },
    ],
})
export class DateComponent implements OnInit, ControlValueAccessor, Validator {
    readonly trackByShortName = trackByProp<MonthInfo>('shortName');
    readonly trackByLongName = trackByProp<MonthInfo>('longName');

    @ViewChild('dayInput') dayInput: ElementRef<HTMLInputElement>;

    /** Specifies if component is required */
    @Input() required: boolean;
    /** Specifies callback when date changes */
    @Output() onDateChanged: EventEmitter<Date | null> = new EventEmitter();
    /** Specifies callback when day changes */
    @Output() onDayChanged: EventEmitter<any> = new EventEmitter();
    /** Specifies callback when month changes */
    @Output() onMonthChanged: EventEmitter<any> = new EventEmitter();
    /** Specifies callback when year changes */
    @Output() onYearChanged: EventEmitter<any> = new EventEmitter();
    /** Specifies if autocomplete is enabled */
    @Input() autocomplete: boolean;
    isDisabled: boolean;
    months: MonthInfo[] = [];
    model: DateModel = { day: null, month: null, year: null };
    days: number[] = [];
    daysInMonth: any;
    ready: boolean;
    yearPattern: string = `/^[0-9]+$/`;
    private touchedElements = new Set<any>();
    private control: UntypedFormControl;

    constructor(
        public dateConfig: DateConfig,
        public commonMessages: CommonMessages,
        private intlService: IntlService,
    ) {}

    /** Specifies that if the parent form valid  */
    @Input() set valid(isValid: boolean) {
        if (this.touchedElements.size !== 3) return;

        this.touchedElements.forEach((element) => this.toggleValidity(isValid, element));
    }

    onChange: (value: any) => void = () => {};

    onTouched = () => {};

    ngOnInit() {
        this.dateConfig.whenReady.pipe(first()).subscribe(() => (this.ready = true));
        this.months = this.intlService.getMonths();
        this.days = this.range(1, 31);
    }

    validate(c: UntypedFormControl): ValidationErrors | null {
        this.control = c;

        const date = this.getDate();

        if (date && !isNaN(date.getTime()) && this.model.year!.length === 4) {
            return null;
        }

        return { isdatetime: true };
    }

    writeValue(obj: Date | string) {
        if (obj) {
            if (typeof obj === 'string') {
                obj = new Date(obj);
            }

            this.model.year = obj.getFullYear().toString();
            this.model.month = obj.getMonth() + 1;
            this.model.day = obj.getDate();
        }
    }

    registerOnChange(fn: any) {
        this.onChange = fn;
    }

    registerOnTouched(fn: any) {
        this.onTouched = fn;
    }

    setDisabledState?(isDisabled: boolean) {
        this.isDisabled = isDisabled;
    }

    range(start: number, end: number): number[] {
        const result: number[] = [];

        for (let i = start; i <= end; i++) {
            result.push(i);
        }

        return result;
    }

    getDate(): Date | null {
        if (this.model.year && this.model.month && this.model.day) {
            //Immediately triggers validation when date component is pre-filled and user does not touch all the inputs.
            this.onTouched();
            const date = new Date(parseInt(this.model.year), this.model.month - 1, Number(this.model.day), 12, 0, 0, 0);

            //Confirm that the values returned from the generated date are the same as passed, since new Date() never throws errors for dates like 31/02.
            if (date.getFullYear().toString() == this.model.year && date.getMonth() == this.model.month - 1 && date.getDate() == this.model.day) {
                return date;
            }
        }

        return null;
    }

    onModelChange() {
        //Dob validation for different dates in a month
        const date = new Date();

        // set default amount of days relying on first month of year
        const defAmountOfDays = new Date(date.getFullYear(), 0).getDate();
        const year = this.model.year ? parseInt(this.model.year) : date.getFullYear();
        const month = this.model.month ? this.model.month : defAmountOfDays;
        this.daysInMonth = new Date(year, month, 0).getDate();
        this.days = this.range(0, this.daysInMonth);

        if (this.model.day && this.days.indexOf(Number(this.model.day)) === -1) {
            this.triggerTouched(this.model.day);
        }

        this.control.updateValueAndValidity();

        const selectedDate = this.getDate();
        this.onChange(selectedDate);

        if (this.onDateChanged) {
            this.onDateChanged.emit(selectedDate);
        }
    }

    triggerTouched(element: any) {
        if (!this.touchedElements.has(element)) {
            this.touchedElements.add(element);
        }

        if (this.touchedElements.size === 3) {
            this.onTouched();
        }
    }

    onDayChange(day: Event) {
        this.triggerTouched(day.target);
        this.onDayChanged.emit(day);
    }

    onMonthChange(month: Event) {
        this.triggerTouched(month.target);
        this.onMonthChanged.emit(month);
    }

    onYearChange(year: Event) {
        this.triggerTouched(year.target);
        this.onYearChanged.emit(year);
    }

    private toggleValidity(isValid: boolean, element: any) {
        isValid ? element.classList.replace('ng-invalid', 'ng-valid') : element.classList.replace('ng-valid', 'ng-invalid');
    }
}
