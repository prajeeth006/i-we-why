import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

/**
 * @whatItDoes Provides a way to get HTML elements with {@link ElementKeyDirective}.
 *
 * @stable
 */
@Injectable({
    providedIn: 'root',
})
export class ElementRepositoryService {
    private elements: Map<string, HTMLElement> = new Map();

    private readonly elements$$ = new BehaviorSubject<Map<string, HTMLElement>>(this.elements);
    readonly elements$ = this.elements$$.asObservable();

    /** Register element with a given key. */
    register(key: string, element: HTMLElement) {
        if (this.elements.has(key)) {
            throw new Error(`Element with key ${key} is already registered. Make sure each registered element has a unique key.`);
        }

        this.elements.set(key, element);
        this.elements$$.next(this.elements);
    }

    /** Get a registered element by key. */
    get(key: string): HTMLElement | null {
        return this.elements.get(key) || null;
    }

    /** Remove a registered element by key. */
    remove(key: string) {
        this.elements.delete(key);
        this.elements$$.next(this.elements);
    }
}
