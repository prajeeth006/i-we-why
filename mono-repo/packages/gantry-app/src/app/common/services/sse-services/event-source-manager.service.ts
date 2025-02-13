import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class EventSourceManager {
    eventSources: Array<EventSource> = [];

    constructor() {}

    add(eventSource: EventSource) {
        this.eventSources.push(eventSource);
    }

    get() {
        return this.eventSources;
    }
}
