import { TrackingEventData } from '@frontend/vanilla/core';

/**
 * @experimental
 */
export interface ConfirmPopupContent {
    leaveButton: string;
    stayButton: string;
    text: string;
    title: string;
}

/**
 * @experimental
 */
export interface ConfirmPopupOptions {
    action: string;
    content?: ConfirmPopupContent;
    trackingDataLoad?: TrackingEventData | undefined; // Optional undefined
    trackingDataClick?: TrackingEventData | undefined; // Optional undefined
}
