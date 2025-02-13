import { Pipe, PipeTransform } from '@angular/core';

import { Observable } from 'rxjs';

import { DslService } from '../dsl/dsl.service';

/**
 * @whatItDoes Applies client side dsl to a content tree. Returns an observable.
 *
 * @howToUse
 *
 * ```
 * <div *ngFor="let item of content | dsl | async">{{item.text}}</div>
 * ```
 *
 * @stable
 */
@Pipe({
    standalone: true,
    name: 'dsl',
    pure: true,
})
export class DslPipe implements PipeTransform {
    constructor(private dslService: DslService) {}

    public transform<T>(value: T): Observable<T> {
        return this.dslService.evaluateContent(value);
    }
}
