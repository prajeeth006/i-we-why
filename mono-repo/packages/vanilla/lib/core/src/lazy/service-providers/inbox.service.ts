import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { LazyServiceProviderBase } from './lazy-service-provider-base';

/**
 * @experimental
 */
export interface InboxOpenOptions {
    showBackButton: boolean;
    trackingEventName?: string;
}

/**
 * @whatItDoes Describes state of inbox (open/closed).
 *
 * @experimental
 */
export interface InboxState {
    isOpen: boolean;
    changeSource?: InboxStateChangeSource;
}

/**
 * @whatItDoes Describes how inbox state was changed.
 *
 * @experimental
 */
export type InboxStateChangeSource = 'back' | 'close';

/**
 * @whatItDoes Provides core inbox functionality.
 *
 * @description
 *
 * # Overview
 *
 * This service provides functionality for manipulating inbox:
 *  - Get information about state
 *  - Get information about count
 *  - Get information about whether the inbox is enabled
 *
 * @stable
 */
@Injectable({
    providedIn: 'root',
})
export class InboxService extends LazyServiceProviderBase {
    get state(): Observable<InboxState> {
        return this.inner.state;
    }

    get count(): Observable<number> {
        return this.inner.count;
    }

    get isEnabled(): boolean {
        return this.inner.isEnabled;
    }

    getCount(): number {
        return this.inner.getCount();
    }

    setState(state: InboxState) {
        this.inner.state.next(state);
    }

    open(options?: InboxOpenOptions) {
        this.inner.open(options);
    }

    close(source?: string) {
        this.inner.close(source); // maybe use eventsservice if this doesnt work, same as productmenu close
    }
}
