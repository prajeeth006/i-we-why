import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';

import { NavigationScrollEvent } from './models';

/**
 * @whatItDoes This service is used to manage scroll related activities in the navigation layout.
 *
 * @stable
 */
@Injectable({
    providedIn: 'root',
})
export class NavigationLayoutScrollService {
    get scrollEvents(): Observable<NavigationScrollEvent | null> {
        return this.scrollEventsSubject.asObservable();
    }

    private scrollEventsSubject = new BehaviorSubject<NavigationScrollEvent | null>(null);

    /** @internal */
    sendScrollEvent(element: HTMLElement, scrolledToBottomPadding: number = 0) {
        const isAtBottom = element.scrollTop >= element.scrollHeight - (element.offsetHeight + scrolledToBottomPadding);
        this.scrollEventsSubject.next({ element, isAtBottom });
    }
}
