import { Injectable } from '@angular/core';

import { Logger } from '../logging/logger';

@Injectable({
    providedIn: 'root',
})
export class AnchorTrackingHelperService {
    constructor(private log: Logger) {}

    createTrackingData(anchorElement: HTMLAnchorElement): { [prop: string]: string } {
        const keyString = anchorElement.getAttribute('data-tracking-keys');
        const valueString = anchorElement.getAttribute('data-tracking-values');
        try {
            const trackingLinkParameters: { [prop: string]: string } = {};
            if (anchorElement instanceof HTMLAnchorElement) {
                const trackingEventName = anchorElement.getAttribute('data-tracking-event');
                if (trackingEventName) {
                    if (keyString && valueString) {
                        const keys = this.parseJson(keyString);
                        const values = this.parseJson(valueString);

                        if (!Array.isArray(keys)) {
                            throw new Error('data-tracking-keys did not deserialize to an array');
                        }

                        if (!Array.isArray(values)) {
                            throw new Error('data-tracking-values did not deserialize to an array');
                        }

                        for (let i = 0; i < keys.length; i++) {
                            if (values[i]) {
                                trackingLinkParameters[keys[i]] = values[i];
                            }
                        }
                    }
                }
            }
            return trackingLinkParameters;
        } catch (err) {
            this.log.warn(
                `Failed deserializing tracking data for plain link. Most likely because of invalid JSON. Keys=${keyString} Values=${valueString}`,
                err,
            );
            return {};
        }
    }
    createMenuActionData(htmlElement: HTMLElement): { [prop: string]: string } {
        const keyString = htmlElement.getAttribute('menu-action-keys');
        const valueString = htmlElement.getAttribute('menu-action-values');
        const menuActionsParameters: { [prop: string]: string } = {};
        try {
            if (keyString && valueString) {
                const keys = this.parseJson(keyString);
                const values = this.parseJson(valueString);

                if (!Array.isArray(keys)) {
                    throw new Error('menu-action-keys did not deserialize to an array');
                }

                if (!Array.isArray(values)) {
                    throw new Error('menu-action-values did not deserialize to an array');
                }

                for (let i = 0; i < keys.length; i++) {
                    if (values[i]) {
                        menuActionsParameters[keys[i]] = values[i];
                    }
                }
            }

            return menuActionsParameters;
        } catch (err) {
            this.log.warn(
                `Failed deserializing menu action parameters for menu action. Most likely because of invalid JSON. Keys=${keyString} Values=${valueString}`,
                err,
            );
            return {};
        }
    }
    getTrackingEventName(anchorElement: HTMLAnchorElement): string | null {
        if (anchorElement instanceof HTMLAnchorElement) {
            return anchorElement.getAttribute('data-tracking-event');
        } else return null;
    }

    parseJson(tracking: string) {
        try {
            return JSON.parse(tracking);
        } catch (e) {
            tracking = tracking.replace(/'/g, '"');
            return JSON.parse(tracking);
        }
    }
}
