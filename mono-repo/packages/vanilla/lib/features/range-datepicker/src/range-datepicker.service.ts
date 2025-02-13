import { Injectable } from '@angular/core';

import { Observable, Subject } from 'rxjs';

import { DateRange } from './range-datepicker.models';

/**
 * @stable
 */
@Injectable({
    providedIn: 'root',
})
export class RangeDatepickerService {
    private readonly applySubject = new Subject<DateRange | null>();
    private readonly closeSubject = new Subject<void>();

    get onApply(): Observable<DateRange | null> {
        return this.applySubject.asObservable();
    }

    get onClose(): Observable<void> {
        return this.closeSubject.asObservable();
    }

    apply(dateRange: DateRange | null) {
        this.applySubject.next(dateRange);
    }

    close() {
        this.closeSubject.next();
    }
}
