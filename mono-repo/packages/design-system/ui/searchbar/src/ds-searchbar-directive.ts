import { Directive, ElementRef, inject } from '@angular/core';
import { FormControlDirective, FormControlName, NgControl } from '@angular/forms';

@Directive({
    selector: '[dsSearchInput]',
    standalone: true,
    host: {
        class: 'ds-search-input',
    },
})
export class DsSearchInput {
    elementRef = inject<ElementRef<HTMLInputElement>>(ElementRef, { optional: true });
    ngControl = inject(NgControl, { optional: true });

    getForm() {
        if (this.ngControl instanceof FormControlDirective) {
            return this.ngControl.form;
        }
        if (this.ngControl instanceof FormControlName) {
            return this.ngControl.control;
        }
        return null;
    }
}
