import { InjectionToken } from '@angular/core';

import { Observable } from 'rxjs';

/**
 * @stable
 */
export enum TriggerEventPromiseResult {
    Normal,
    Timeout,
}

type UtmKeys = 'utm_source' | 'utm_medium' | 'utm_campaign' | 'utm_term' | 'utm_content' | 'utm_keyword';
export type Utm = { [key in UtmKeys]: string };

/**
 * @stable
 */
export type TrackingData = { [key: string]: any };

/**
 * @experimental
 */
export type TrackingEventData = {
    eventName: string;
    data?: TrackingData;
};

/**
 * @stable
 */
export interface PageViewContext {
    /** Angular client navigation id. */
    navigationId: number;
    utm: Utm | null;
}

/**
 * @stable
 */
export interface PageViewDataProvider {
    getData(context?: PageViewContext): Observable<TrackingData>;
}

/**
 * @stable
 */
export const PAGE_VIEW_DATA_PROVIDER = new InjectionToken<PageViewDataProvider[]>('page-view-data-provider');
