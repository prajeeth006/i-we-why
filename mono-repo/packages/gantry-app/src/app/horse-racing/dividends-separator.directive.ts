import { Directive, HostBinding, Input } from '@angular/core';

@Directive({
    selector: '[gnDividendsSeparator]',
})
export class DividendsSeparatorDirective {
    private values: string[] = [];

    @HostBinding('innerHTML') get content(): string {
        const firstGroup = this.values.slice(0, 4).join('/');
        const secondGroup = this.values.slice(4).join('/');

        let result = `<span>${firstGroup}</span>`;

        if (secondGroup.trim() !== '') {
            result += ` <span>${secondGroup}</span>`;
        }

        return result;
    }

    @Input() set gnDividendsSeparator(value: string) {
        this.values = value ? value.split('/') : [];
    }
}
