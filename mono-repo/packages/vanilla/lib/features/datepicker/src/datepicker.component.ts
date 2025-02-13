import { OverlayModule, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostBinding, Injector, Input, OnInit, Output } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

import { CommonMessages, DeviceService } from '@frontend/vanilla/core';
import { IconCustomComponent } from '@frontend/vanilla/features/icons';
import { OverlayFactory } from '@frontend/vanilla/shared/overlay-factory';
import { NgbDate, NgbDatepickerConfig, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxFloatUiModule, NgxFloatUiPlacements, NgxFloatUiTriggers } from 'ngx-float-ui';

import { DatePickerCalendarComponent } from './datepicker-calendar.component';
import { DatePickerService, DateRange } from './datepicker.service';

/**
 * @whatItDoes Provides additional wrapper around `NgbDatePicker` component with basic configurations.
 *
 * @howToUse
 *
 * `
 * <form class="form-base floating-form">
 *      <lh-form-field labelText="Date Range" [elementClass]="'form-group-label-i-l'">
 *          <vn-datepicker [(ngModel)]="dateRange" [rangeEnabled]="true" name="vndatepickerrange" id="datepickerRange" />
 *      </lh-form-field>
 * </form>`
 *
 * @description
 *
 * This component is meant to be used in conjunction with [ng-bootstrap](https://www.npmjs.com/package/@ng-bootstrap/ng-bootstrap) library.
 *
 * @experimental
 */
@Component({
    standalone: true,
    imports: [DatePickerCalendarComponent, FormsModule, CommonModule, NgbDatepickerModule, NgxFloatUiModule, OverlayModule, IconCustomComponent],
    selector: 'vn-datepicker',
    templateUrl: 'datepicker.html',
    styles: [
        `
            .vn-dp-input-container {
                .theme-up,
                .theme-down {
                    @media (width <= 768px) and (orientation: portrait), (width <= 740px) and (orientation: landscape) {
                        display: none;
                    }
                }

                .vn-datepicker {
                    padding-bottom: 5px;
                }
            }
        `,
    ],
    providers: [
        DatePickerService,
        NgbDatepickerConfig,
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: DatePickerComponent,
            multi: true,
        },
    ],
})
export class DatePickerComponent implements ControlValueAccessor, OnInit {
    @HostBinding('attr.class') get class(): string {
        return 'vn-datepicker';
    }

    overlayRef: OverlayRef;
    model: NgbDateRange;
    formattedValue: string;
    hoveredDate: NgbDate | null = null;
    readonly FloatUiPlacements = NgxFloatUiPlacements;
    readonly FloatUiTriggers = NgxFloatUiTriggers;

    /**
     * Custom configuration for the datepicker. [List of available configs from the package](https://ng-bootstrap.github.io/#/components/datepicker/api#NgbDatepickerConfig)
     */
    @Input() config: NgbDatepickerConfig;

    /**
     * Whether to disable the calendar popup showing on click.
     */
    @Input() disabled: boolean = false;

    /**
     * Whether to enable date range selection.
     */
    @Input() rangeEnabled: boolean = false;

    /**
     * Format of the date to be shown in the input.
     */
    @Input() dateFormat: string = 'MMM dd, yyyy';

    /**
     * Whether to enable the calendar dropdown.
     */
    @Input() calendarDropdownEnabled: boolean = true;

    /**
     * Text to display on save button.
     */
    @Input() saveText: string;

    /**
     * Whether to show the header of the calendar.
     */
    @Input() headerEnabled: boolean = true;

    /**
     * Whether to show the footer of the calendar.
     */
    @Input() footerEnabled: boolean = true;

    /**
     * Event emitter for date change.
     */
    @Output() onDateChangeEvent: EventEmitter<Date | DateRange | null> = new EventEmitter();

    constructor(
        public datePickerService: DatePickerService,
        public commonMessages: CommonMessages,
        public deviceService: DeviceService,
        private overlay: OverlayFactory,
        private ngbDatepickerConfig: NgbDatepickerConfig,
        private injector: Injector,
    ) {}

    ngOnInit() {
        if (this.config) {
            Object.assign(this.ngbDatepickerConfig, this.config, {
                dayTemplate: undefined,
                footerTemplate: undefined,
                navigation: 'arrow',
            });
        }
    }

    onChange: (value: Date | DateRange) => void = () => {};
    onTouched = () => {};

    writeValue(value: Date | DateRange | null) {
        this.formattedValue = this.datePickerService.formatModel(value, this.dateFormat);

        if (value) {
            this.model = this.datePickerService.parseDate(value);
        }
    }

    registerOnChange(fn: () => void) {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void) {
        this.onTouched = fn;
    }

    onDateChange(date: Date | DateRange) {
        this.onDateChangeEvent.emit(date);
        this.onDateSelected(date);
    }

    onDateSelected(date: Date | DateRange) {
        this.onChange(date);
        this.formattedValue = this.datePickerService.formatModel(date, this.dateFormat);
    }

    openDialog() {
        if (this.disabled) {
            return;
        }

        this.overlayRef = this.overlay.create({
            panelClass: ['vn-datepicker'],
        });
        this.overlayRef.backdropClick().subscribe(() => this.overlay.dispose(this.overlayRef));

        const portal = new ComponentPortal(
            DatePickerCalendarComponent,
            null,
            Injector.create({
                providers: [{ provide: OverlayRef, useValue: this.overlayRef }],
                parent: this.injector,
            }),
        );

        const componentRef = this.overlayRef.attach(portal);
        componentRef.setInput('headerEnabled', this.headerEnabled);
        componentRef.setInput('footerEnabled', this.footerEnabled);
        componentRef.setInput('rangeEnabled', this.rangeEnabled);
        componentRef.setInput('dateFormat', this.dateFormat);
        componentRef.setInput('saveText', this.saveText);

        if (this.model) {
            componentRef.setInput('startDate', this.model.start);
            componentRef.setInput('endDate', this.model.end);
        }

        componentRef.instance.onDateSelectedEvent.subscribe((date: Date | DateRange | null) => {
            if (date) {
                this.onDateSelected(date);
            }
        });
        componentRef.instance.onCloseEvent.subscribe(() => {
            this.overlayRef.detach();
        });
    }
}

/**
 * @experimental
 */
export class NgbDateRange {
    start: NgbDate | null;
    end: NgbDate | null;
}
