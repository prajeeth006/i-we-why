import { Injectable } from '@angular/core';

import { Observable, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AccountMenuScrollService {
    private scrollEvents = new Subject<number>();
    private scrollToEvents = new Subject<{ x: number; y: number }>();

    get scroll(): Observable<number> {
        return this.scrollEvents;
    }

    get onScrollTo(): Observable<{ x: number; y: number }> {
        return this.scrollToEvents;
    }

    onScroll(event: Event) {
        const target = event.target as HTMLElement;
        this.scrollEvents.next(target.scrollTop);
    }

    scrollTo(x: number, y: number) {
        this.scrollToEvents.next({ x, y });
    }
}
