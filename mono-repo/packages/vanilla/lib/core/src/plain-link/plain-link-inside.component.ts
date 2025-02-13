import { Component, OnInit, inject } from '@angular/core';

import { TrackingService } from '../core';
import { NavigationService } from '../navigation/navigation.service';
import { DynamicHtmlButtonComponentBase } from './dynamic-html-button-component-base';

/**
 * @whatItDoes Handles behavior of standard `a` link with `href`  that are inside a component with div or span
 *
 * @howToUse
 *
 * If this directive is imported, it will be automatically used for all matching links. Is is also used on links inside
 * of rich text in page matrix components.
 *
 * You can set `data-tracking-event="eventName"` and `data-tracking-data.propertyName="value"` to a sitecore link
 * (or other link that uses `PlainLinkInsideComponent`) and the values will be tracked when the link is clicked.
 *
 * @stable
 */

@Component({
    standalone: true,
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'span | div',
    template: '<ng-content />',
})
export class PlainLinkInsideComponent extends DynamicHtmlButtonComponentBase implements OnInit {
    private trackService = inject(TrackingService);
    constructor(private navigationService: NavigationService) {
        super();
    }

    override ngOnInit() {
        super.ngOnInit();
    }

    override async processClick(event: Event): Promise<void> {
        const el = event.target as HTMLAnchorElement;
        if (el instanceof HTMLAnchorElement) {
            event.preventDefault();
            const trackingEventName = this.anchorTrackingHelperService.getTrackingEventName(el);
            if (trackingEventName) {
                const trackingData = this.anchorTrackingHelperService.createTrackingData(el);
                await this.trackService.triggerEvent(trackingEventName, trackingData);
            }

            const targetUrl = el.getAttribute('href');

            if (targetUrl) {
                if (targetUrl === '#' || targetUrl === '') {
                    return;
                }
                return new Promise((resolve) => {
                    setTimeout(() => {
                        this.navigationService.goTo(targetUrl);
                        resolve();
                    });
                });
            }
        }
    }
}
