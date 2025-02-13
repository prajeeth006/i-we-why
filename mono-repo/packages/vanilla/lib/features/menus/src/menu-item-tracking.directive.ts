import { Directive, HostListener, Input, OnInit, inject } from '@angular/core';

import { MenuContentItem, TrackingService, WebAnalyticsEventType } from '@frontend/vanilla/core';

import { MenuItemClickHandlerService } from './menu-item-click-handler.service';

/**
 * @whatItDoes Adds data to the datalayer based on item tracking data provided via Sitecore in item parameters or WebAnalytics section.
 *
 *
 * @howToUse
 *
 * ```
 * <ng-container vnMenuItemTracking [item]="item"  />
 * ```
 * @stable
 */
@Directive({
    standalone: true,
    selector: '[vnMenuItemTracking]',
})
export class MenuItemTrackingDirective implements OnInit {
    private trackingService = inject(TrackingService);

    private menuItemClickHandlerService = inject(MenuItemClickHandlerService);

    @HostListener('click') async onClick() {
        await this.click();
    }

    @Input() item: MenuContentItem;

    ngOnInit() {
        this.trackingService.trackEvents(this.item, WebAnalyticsEventType.load);
    }

    async click() {
        await this.menuItemClickHandlerService.handleMenuTrack(this.item);
    }
}
