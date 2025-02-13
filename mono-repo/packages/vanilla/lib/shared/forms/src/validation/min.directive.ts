import { Directive, Input, OnChanges, OnInit, SimpleChanges, forwardRef } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator, ValidatorFn, Validators } from '@angular/forms';

const min = (min: number): ValidatorFn => {
    return (control: AbstractControl): ValidationErrors | null => {
        if (!min) return null;
        if (Validators.required(control)) return null;

        const v: number = +control.value;
        return v >= +min ? null : { actualValue: v, requiredValue: +min, min: true };
    };
};

const MIN_VALIDATOR: any = {
    provide: NG_VALIDATORS,
    // eslint-disable-next-line @angular-eslint/no-forward-ref
    useExisting: forwardRef(() => MinDirective),
    multi: true,
};

/**
 * @whatItDoes Provides min validator
 *
 * @stable
 */
@Directive({
    standalone: true,
    // eslint-disable-next-line @angular-eslint/directive-selector
    selector: '[min][formControlName],[min][formControl],[min][ngModel]',
    providers: [MIN_VALIDATOR],
})
export class MinDirective implements Validator, OnInit, OnChanges {
    @Input() min: number;

    private validator: ValidatorFn;
    private onChange: () => void;

    ngOnInit() {
        this.validator = min(this.min);
    }

    ngOnChanges(changes: SimpleChanges) {
        for (const key in changes) {
            if (key === 'min') {
                this.validator = min(changes[key]!.currentValue);
                if (this.onChange) this.onChange();
            }
        }
    }

    validate(c: AbstractControl): ValidationErrors | null {
        return this.validator(c);
    }

    registerOnValidatorChange(fn: () => void): void {
        this.onChange = fn;
    }
}
