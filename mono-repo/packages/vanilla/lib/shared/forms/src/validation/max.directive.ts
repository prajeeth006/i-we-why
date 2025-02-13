import { Directive, Input, OnChanges, OnInit, SimpleChanges, forwardRef } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator, ValidatorFn, Validators } from '@angular/forms';

const max = (max: number): ValidatorFn => {
    return (control: AbstractControl): ValidationErrors | null => {
        if (!max) return null;
        if (Validators.required(control)) return null;

        const v: number = +control.value;
        return v <= +max ? null : { actualValue: v, requiredValue: +max, max: true };
    };
};

const MAX_VALIDATOR: any = {
    provide: NG_VALIDATORS,
    // eslint-disable-next-line @angular-eslint/no-forward-ref
    useExisting: forwardRef(() => MaxDirective),
    multi: true,
};

/**
 * @whatItDoes Provides max validator
 *
 * @stable
 */
@Directive({
    standalone: true,
    // eslint-disable-next-line @angular-eslint/directive-selector
    selector: '[max][formControlName],[max][formControl],[max][ngModel]',
    providers: [MAX_VALIDATOR],
})
export class MaxDirective implements Validator, OnInit, OnChanges {
    @Input() max: number;

    private validator: ValidatorFn;
    private onChange: () => void;

    ngOnInit() {
        this.validator = max(this.max);
    }

    ngOnChanges(changes: SimpleChanges) {
        for (const key in changes) {
            if (key === 'max') {
                this.validator = max(changes[key]!.currentValue);
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
