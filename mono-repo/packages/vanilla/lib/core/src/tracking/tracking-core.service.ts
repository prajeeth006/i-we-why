import { Injectable } from '@angular/core';

import { Observable, ReplaySubject, first, firstValueFrom, map } from 'rxjs';

import { MenuContentItem } from '../content/content.models';
import { LazyServiceProviderBase } from '../lazy/service-providers/lazy-service-provider-base';
import { TriggerEventPromiseResult } from './tracking-core.models';
import { WebAnalyticsEventType } from './tracking-provider';

@Injectable({
    providedIn: 'root',
})
export class TrackingService extends LazyServiceProviderBase {
    private _initialValuesTracked = new ReplaySubject<void>(1);
    //Observable used to avoid any other tracking to happen before Vanilla initial values are tracked.
    private get initialValuesTracked(): Observable<void> {
        return this._initialValuesTracked.pipe(first());
    }

    async addInitialValues() {
        return firstValueFrom(this.whenReady)
            .then(() => this.inner.addInitialValues())
            .then(() => this._initialValuesTracked.next());
    }

    getContentItemTracking(parameters: { [name: string]: string } | undefined, parameterName: string) {
        return this.whenReady.pipe(map(() => this.inner.getContentItemTracking(parameters, parameterName)));
    }

    private get initialized() {
        return Promise.all([firstValueFrom(this.whenReady), firstValueFrom(this.initialValuesTracked)]);
    }

    updateUserValues(): Promise<void> {
        return this.initialized.then(() =>
            this.inner
                .updateUserValues()
                .then(() => void 0)
                .catch(() => void 0),
        );
    }

    updateDataLayer(data: any): Promise<void> {
        return this.initialized.then(() =>
            this.inner
                .updateDataLayer(data)
                .then(() => void 0)
                .catch(() => void 0),
        );
    }

    updateUserContactabilityStatus(): void {
        this.initialized.then(() => this.inner.updateUserContactabilityStatus());
    }

    trackEvents(item: MenuContentItem, type: WebAnalyticsEventType): Promise<TriggerEventPromiseResult> {
        return this.initialized.then(() =>
            this.inner
                .trackEvents(item, type)
                .then(() => TriggerEventPromiseResult.Normal)
                .catch(() => TriggerEventPromiseResult.Timeout),
        );
    }

    triggerEvent(eventName: string, data?: any, options?: any): Promise<TriggerEventPromiseResult> {
        return this.initialized.then(() =>
            this.inner
                .triggerEvent(eventName, data, options)
                .then(() => TriggerEventPromiseResult.Normal)
                .catch(() => TriggerEventPromiseResult.Timeout),
        );
    }

    reportError(errorDetail: any): void {
        this.initialized.then(() => this.inner.reportError(errorDetail));
    }

    reportErrorObject(errorDetail: any): Promise<void> {
        return this.initialized.then(() =>
            this.inner
                .reportErrorObject(errorDetail)
                .then(() => void 0)
                .catch(() => void 0),
        );
    }

    setReferrer(referrer: string): void {
        this.initialized.then(() => this.inner.setReferrer(referrer));
    }

    trackContentItemEvent(parameters: { [name: string]: string } | undefined, arg1: string) {
        this.initialized.then(() => this.inner.trackContentItemEvent(parameters, arg1));
    }
}
