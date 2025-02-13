import { Injectable } from '@angular/core';

import { LazyServiceProviderBase } from '../lazy/service-providers/lazy-service-provider-base';

/**
 * @whatItDoes Injects all configured client-side tag manager scripts into the DOM.
 *
 * @description
 *
 * Client-side tag managers can be configured using TrackingConfig.
 *
 * @stable
 */
@Injectable({
    providedIn: 'root',
})
export class TagManagerService extends LazyServiceProviderBase {
    /** @stable */
    get availableClientTagManagers(): string[] {
        return this.inner.availableClientTagManagers();
    }
    /** Adds a tag manager init script for the given tag manager renderer name to the script unless present.
     *
     * @stable
     */
    public load(rendererName: string, type?: string) {
        return this.inner.load(rendererName, type);
    }
    public loadPartyTownGTM() {
        return this.inner.loadPartyTownGTM();
    }
}
