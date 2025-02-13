import { Directive, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

import { Validators } from '../validation/validators';

/**
 * @whatItDoes Provides MinDate, MaxDate, YoungerThan and OlderThan validator
 *
 * @stable
 */
@Directive({
    standalone: true,
    selector: '[lhMinDate],[lhMaxDate],[lhYoungerThan],[lhOlderThan]',
    providers: [{ provide: NG_VALIDATORS, useExisting: DateRangeValidatorDirective, multi: true }],
})
export class DateRangeValidatorDirective implements Validator {
    @Input() set lhMinDate(value: Date) {
        this.minDate = value;

        if (this.onValidatorChange) {
            this.onValidatorChange();
        }
    }

    @Input() set lhMaxDate(value: Date) {
        this.maxDate = value;

        if (this.onValidatorChange) {
            this.onValidatorChange();
        }
    }

    @Input() set lhYoungerThan(value: number) {
        this.youngerThan = value;

        if (this.onValidatorChange) {
            this.onValidatorChange();
        }
    }

    @Input() set lhOlderThan(value: number) {
        this.olderThan = value;

        if (this.onValidatorChange) {
            this.onValidatorChange();
        }
    }

    private minDate: Date;
    private maxDate: Date;
    private youngerThan: number;
    private olderThan: number;
    private onValidatorChange: () => void;

    validate(c: AbstractControl): ValidationErrors | null {
        if (!c.value) {
            return null;
        }

        const result = {};
        if (this.minDate) {
            Object.assign(result, Validators.minDate(this.minDate)(c));
        }
        if (this.maxDate) {
            Object.assign(result, Validators.maxDate(this.maxDate)(c));
        }
        if (this.youngerThan) {
            Object.assign(result, Validators.youngerThan(this.youngerThan)(c));
        }
        if (this.olderThan) {
            Object.assign(result, Validators.olderThan(this.olderThan)(c));
        }

        return Object.keys(result).length ? result : null;
    }

    registerOnValidatorChange?(fn: () => void): void {
        this.onValidatorChange = fn;
    }
}
