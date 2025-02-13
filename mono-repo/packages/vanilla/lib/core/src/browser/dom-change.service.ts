import { Injectable } from '@angular/core';

import { Observable, Subscriber } from 'rxjs';

/**
 * @stable
 */
@Injectable({
    providedIn: 'root',
})
export class DomChangeService {
    observe(element: HTMLElement): Observable<MutationRecord> {
        return new Observable((observer: Subscriber<MutationRecord>) => {
            const mutationObserver = new MutationObserver((mutations: MutationRecord[]) => {
                mutations.forEach((m: MutationRecord) => observer.next(m));
            });

            observer.add(() => mutationObserver.disconnect());

            mutationObserver.observe(element, {
                subtree: true,
                childList: true,
            });
        });
    }
}
