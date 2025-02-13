import { Pipe, PipeTransform } from '@angular/core';

import { HeaderService } from './header.service';

/**
 * @whatItDoes Gets lazy sub header component based on type. Returns an observable.
 *
 * @howToUse
 *
 * ```
 * <div *ngIf="'balance' | getLazyComponent | async as cmp">{{item.text}}</div>
 * ```
 *
 * @stable
 */
@Pipe({
    standalone: true,
    name: 'getLazyComponent',
})
export class GetLazyComponentPipe implements PipeTransform {
    constructor(private headerService: HeaderService) {}

    public transform(type: string) {
        return this.headerService.getLazyComponent(type);
    }
}
