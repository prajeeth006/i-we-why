import { Inject, Injectable } from '@angular/core';

import { CustomWindow } from '../window/window-ref.service';
import { WINDOW } from '../window/window.token';
import { BaseStoreService, STORE_PREFIX, getBackend } from './base-store.service';

/**
 * @whatItDoes Provides access to local and session storage of the browser
 *
 * @howToUse
 *
 * register store prefix
 * ```
 * import { STORE_PREFIX } from '@frontend/vanilla';
 *
 * @NgModule({
 *     providers: [
 *         { provide: STORE_PREFIX, useValue: 'your_prefix' }
 *     ]
 * })
 * export class AppModule { }
 * ```
 *
 * ```
 * localStoreService.set('key', 'value');
 * localStoreService.get('key');
 * localStoreService.remove('key');
 * ```
 *
 * For local storage use `LocalStoreService` with the same API.
 *
 * @description
 *
 * A wrapper for [`localStorage`](https://developer.mozilla.org/en-US/docs/Web/Guide/DOM/Storage).
 *
 * `localStorage` works the same ways as {@link SessionStoreService}, except it's persistent across sessions.
 *
 * The keys under which data is stored is automatically prefixed with the prefix set by `STORE_PREFIX`.
 *
 * @stable
 */
@Injectable({
    providedIn: 'root',
})
export class LocalStoreService extends BaseStoreService {
    constructor(@Inject(WINDOW) _window: CustomWindow, @Inject(STORE_PREFIX) prefix: string) {
        super(getBackend(_window, 'local'), prefix);
    }
}
