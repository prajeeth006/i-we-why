import { Directive, HostListener, forwardRef, inject } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { ReCaptchaComponent } from './recaptcha.component';

@Directive({
    standalone: true,
    // eslint-disable-next-line @angular-eslint/directive-selector
    selector: 'vn-re-captcha',
    providers: [
        {
            multi: true,
            provide: NG_VALUE_ACCESSOR,
            // eslint-disable-next-line @angular-eslint/no-forward-ref
            useExisting: forwardRef(() => ReCaptchaValueAccessorDirective),
        },
    ],
})
export class ReCaptchaValueAccessorDirective implements ControlValueAccessor {
    private host = inject(ReCaptchaComponent);

    private onChange: (value: string) => void;
    private onTouched: () => void;

    writeValue(value: string) {
        if (!value) {
            this.host.reset();
        }
    }

    registerOnChange(fn: (value: string) => void) {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void) {
        this.onTouched = fn;
    }

    @HostListener('resolved', ['$event'])
    onResolve($event: string) {
        if (this.onChange) {
            this.onChange($event);
        }

        if (this.onTouched) {
            this.onTouched();
        }
    }
}
