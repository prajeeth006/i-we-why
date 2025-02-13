import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

/**
 * @stable
 */
@Directive({
    standalone: true,
    selector: '[lhNumberOnly]',
})
export class NumberOnlyDirective {
    private pattern = /[^0-9]/g;
    constructor(private control: NgControl) {}

    @HostListener('input', ['$event'])
    onInput(event: KeyboardEvent) {
        const element = event.target as HTMLInputElement;
        const newValue = element.value.replace(this.pattern, '');
        if (newValue !== element.value) {
            this.control.control!.setValue(newValue);
        }
    }

    @HostListener('keydown', ['$event'])
    onKeyDown(event: KeyboardEvent) {
        if (event.ctrlKey || event.altKey || event.metaKey || event.shiftKey) {
            return;
        }

        // prevent of typing non digit characters
        if (event.key && event.key.length === 1 && event.key.match(this.pattern)) {
            event.preventDefault();
        }
    }
}
