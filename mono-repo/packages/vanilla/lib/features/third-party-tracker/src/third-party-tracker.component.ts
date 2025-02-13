import { Component } from '@angular/core';

import { TrustAsHtmlPipe } from '@frontend/vanilla/shared/browser';

import { ThirdPartyTrackingService } from './third-party-tracking.service';

/**
 * @stable
 */
@Component({
    standalone: true,
    imports: [TrustAsHtmlPipe],
    selector: 'vn-third-party-tracker',
    host: { style: 'display: block; width: 0; height: 0; overflow: hidden;' },
    template: '@if (url) {<img width="1" height="1" [src]="url" />}@if (content) {<div [innerHTML]="content | trustAsHtml"></div>}',
})
export class ThirdPartyTrackerComponent {
    url: string | null;
    content: string | null;

    constructor(thirdPartyTrackerService: ThirdPartyTrackingService) {
        thirdPartyTrackerService.trackingContent.subscribe((trackingContent: string | null) => {
            this.url = null;
            this.content = null;

            if (!trackingContent) {
                return;
            }

            if (trackingContent.indexOf('http') === 0) {
                this.url = trackingContent;
            } else {
                this.content = trackingContent;
            }
        });
    }
}
