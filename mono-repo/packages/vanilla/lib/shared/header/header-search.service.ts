import { Injectable } from '@angular/core';

import { Observable, Subject } from 'rxjs';

/** @stable */
@Injectable({
    providedIn: 'root',
})
export class HeaderSearchService {
    private events: Subject<void> = new Subject();

    /** Observable of when the header search input is clicked. */
    get clickEvent(): Observable<void> {
        return this.events.pipe();
    }

    click() {
        this.events.next();
    }
}
