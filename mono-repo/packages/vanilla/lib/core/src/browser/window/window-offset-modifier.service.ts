import { Inject, Injectable, InjectionToken, inject } from '@angular/core';

import { Observable } from 'rxjs';

import { WINDOW } from './window.token';

/**
 * @stable
 */
export interface WindowOffsetProvider {
    getOffset(offset: number): Observable<number>;
}

/**
 * @stable
 */
export const WINDOW_OFFSET_PROVIDER = new InjectionToken<WindowOffsetProvider[]>('vn-window-offset-provider');

/**
 * @stable
 */
@Injectable({
    providedIn: 'root',
})
export class WindowOffsetModifierService {
    readonly #window = inject(WINDOW);

    constructor(@Inject(WINDOW_OFFSET_PROVIDER) private windowOffsetProviders: WindowOffsetProvider[]) {}

    scrollBy(offset: number) {
        this.windowOffsetProviders.forEach((p) => {
            p.getOffset(offset).subscribe((scrollDiff) => {
                if (scrollDiff < 0) {
                    this.#window.scrollBy(0, scrollDiff);
                }
            });
        });
    }
}
