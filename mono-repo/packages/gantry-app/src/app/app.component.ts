import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';

import { EventSourceManager } from './common/services/sse-services/event-source-manager.service';

@Component({
    selector: 'gn-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
    title = 'Gantry';

    constructor(private eventSourceManager: EventSourceManager) {}

    @HostListener('window:beforeunload', ['$event'])
    ngOnDestroy() {
        const eventSources = this.eventSourceManager.get();

        eventSources.forEach((eventSource) => {
            eventSource.close();
        });
    }

    ngOnInit() {
        window.parent.postMessage({ url: window.location.href });
    }
}
