import { InjectionToken } from '@angular/core';

import { MenuContentItem } from '../content/content.models';
import { TriggerEventPromiseResult } from './tracking-core.models';

export interface WebAnalyticsEvents {
    load?: { eventName: string; data: any };
    click?: { eventName: string; data: any };
    close?: { eventName: string; data: any };
}

export enum WebAnalyticsEventType {
    load,
    click,
    close,
}

/**
 * @whatItDoes Tracks events to underlying tracking system.
 *
 * @howToUse
 *
 * ```
 * trackingService.updateDataLayer({ val: 1 });
 * trackingService.triggerEvent('event1');
 * ```
 *
 * @stable
 */
export interface TrackingServiceProvider {
    addInitialValues(): void;
    getContentItemTracking(
        parameters: { [name: string]: string } | undefined,
        parameterName: string,
    ): { event: string; data: { [key: string]: string } } | null;
    trackContentItemEvent(parameters: { [name: string]: string } | undefined, parameterName: string): void;
    trackEvents(item: MenuContentItem, eventType: WebAnalyticsEventType): void;
    triggerEvent(eventName: string, data?: any, options?: any): Promise<TriggerEventPromiseResult>;
    reportError(errorDetail: any): void;
    reportErrorObject(errorDetail: any): void;
    setReferrer(referrer: string): void;
    updateDataLayer(data?: any): Promise<void>;
    updateUserContactabilityStatus(): void;
    updateUserValues(): void;
}

/**
 * @stable
 */
export const TRACKING_SERVICE_PROVIDER = new InjectionToken<TrackingServiceProvider>('tracking-provider');
