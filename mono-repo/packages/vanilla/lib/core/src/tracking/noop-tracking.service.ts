import { Injectable } from '@angular/core';

import { TriggerEventPromiseResult } from './tracking-core.models';
import { TrackingServiceProvider } from './tracking-provider';

/**
 * @stable
 *
 * Default service with no tracking, to be used in case no other TrackingServiceProvider is registered
 */
@Injectable({
    providedIn: 'root',
})
export class NoopTrackingService implements TrackingServiceProvider {
    addInitialValues(): Promise<void> {
        return Promise.resolve();
    }

    getContentItemTracking(): { event: string; data: { [key: string]: string } } | null {
        return null;
    }

    trackContentItemEvent() {
        // This is intentional
    }

    updateUserContactabilityStatus() {
        // This is intentional
    }

    updateUserValues(): Promise<void> {
        return Promise.resolve();
    }

    updateDataLayer(): Promise<void> {
        return Promise.resolve();
    }

    trackEvents(): Promise<void> {
        return Promise.resolve();
    }

    triggerEvent(): Promise<TriggerEventPromiseResult> {
        return Promise.resolve(TriggerEventPromiseResult.Normal);
    }

    reportError(): Promise<void> {
        return Promise.resolve();
    }

    reportErrorObject(): Promise<void> {
        return Promise.resolve();
    }

    setReferrer() {
        // This is intentional
    }
}
