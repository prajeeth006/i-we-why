import { ElementRef, Injectable } from '@angular/core';

import { Observable, ReplaySubject, Subject, share } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ResizeObserverService {
    private changes$ = new Subject<ResizeObserverEntry[]>();
    private elementChanges = new WeakMap<HTMLElement, Observable<ResizeObserverEntry>>();
    private observer = new ResizeObserver((entries: ResizeObserverEntry[]) => this.changes$.next(entries));

    observe(element: ElementRef<HTMLElement> | HTMLElement, options?: ResizeObserverOptions): Observable<ResizeObserverEntry> {
        const el = element instanceof ElementRef ? element.nativeElement : element;
        let elementChanges$ = this.elementChanges.get(el);
        if (!elementChanges$) {
            this.observer.observe(el, options);

            elementChanges$ = new Observable<ResizeObserverEntry>((observer) => {
                const inner = this.changes$.subscribe((changes) => {
                    const change = changes.find((e) => e.target === el);
                    if (change) {
                        observer.next(change);
                    }
                });

                return () => {
                    inner.unsubscribe();
                    this.observer.unobserve(el);
                    this.elementChanges.delete(el);
                };
            }).pipe(share({ connector: () => new ReplaySubject(1), resetOnRefCountZero: true }));

            this.elementChanges.set(el, elementChanges$);
        }

        return elementChanges$;
    }
}
