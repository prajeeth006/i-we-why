import { Injectable } from '@angular/core';

import { ContentItem, TrackingService } from '@frontend/vanilla/core';

@Injectable({
    providedIn: 'root',
})
export class ContentMessagesTrackingService {
    private trackedLoadEvents = new Set<string>();

    constructor(private trackingService: TrackingService) {}

    trackMessageLoaded(message: ContentItem, scope: string) {
        const key = scope + message.name;

        if (this.trackedLoadEvents.has(key)) {
            return;
        }

        this.trackedLoadEvents.add(key);
        this.trackingService.trackContentItemEvent(message.parameters, 'tracking.LoadedEvent');
    }

    trackMessageClosed(message: ContentItem) {
        this.trackingService.trackContentItemEvent(message.parameters, 'tracking.ClosedEvent');
    }
}
