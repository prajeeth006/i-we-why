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
 *         { provide: STORE_PREFIX, useValue: 'your_prefix.' }
 *     ]
 * })
 * export class AppModule { }
 * ```
 *
 * ```
 * sessionStoreService.set('key', 'value');
 * sessionStoreService.get('key');
 * sessionStoreService.remove('key');
 * ```
 *
 * @description
 *
 * A wrapper for [`sessionStorage`](https://developer.mozilla.org/en-US/docs/Web/Guide/DOM/Storage).
 *
 * `sessionStorage` maintains a storage area that's available for the duration of the page session.
 * A page session lasts for as long as the browser is open and survives over page reloads and restores.
 * Opening a page in a new tab or window will cause a new session to be initiated.
 *
 * The keys under which data is stored is automatically prefixed with the prefix set by `STORE_PREFIX`.
 *
 * @stable
 */
@Injectable({
    providedIn: 'root',
})
export class SessionStoreService extends BaseStoreService {
    constructor(@Inject(WINDOW) _window: CustomWindow, @Inject(STORE_PREFIX) prefix: string) {
        super(getBackend(_window, 'session'), prefix);
    }
}
