import { Directive, ElementRef, Renderer2 } from '@angular/core';
import { ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator } from '@angular/forms';

/**
 * @stable
 */
@Directive({
    standalone: true,
    // eslint-disable-next-line @angular-eslint/directive-selector
    selector: 'input[type=number][ngModel], input[type=number][formControl], input[type=number][formControlName]',
    providers: [
        { provide: NG_VALIDATORS, useExisting: NumberInputDirective, multi: true },
        { provide: NG_VALUE_ACCESSOR, useExisting: NumberInputDirective, multi: true },
    ],
    host: {
        '(change)': 'onChange($event.target.value)',
        '(input)': 'onChange($event.target.value)',
        '(blur)': 'onTouched()',
    },
})
export class NumberInputDirective implements Validator, ControlValueAccessor {
    private element: HTMLInputElement;

    constructor(
        private renderer: Renderer2,
        elementRef: ElementRef,
    ) {
        this.element = elementRef.nativeElement;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onChange = (_: any) => {};
    onTouched = () => {};

    validate(): ValidationErrors | null {
        if (this.element.validity.badInput) {
            return { number: true };
        }

        return null;
    }

    writeValue(value: number): void {
        // The value needs to be normalized for IE9, otherwise it is set to 'null' when null
        const normalizedValue = value == null ? '' : value;
        this.renderer.setProperty(this.element, 'value', normalizedValue);
    }

    registerOnChange(fn: (_: number | null) => void): void {
        this.onChange = (value) => {
            fn(this.element.validity.badInput ? NaN : value == '' ? null : parseFloat(value));
        };
    }

    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.renderer.setProperty(this.element, 'disabled', isDisabled);
    }
}
