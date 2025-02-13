import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { TrackingService, WebAnalyticsEventType } from '@frontend/vanilla/core';
import { TrustAsHtmlPipe } from '@frontend/vanilla/shared/browser';

import { AccountMenuItemBase } from '../../account-menu-item-base';
import { AccountMenuWidgetComponent } from './widget.component';

/**
 * Sitecore: {@link http://cms.prod.env.works/sitecore/DirectLink.aspx?fo={5E509F35-AB2B-4528-B84E-B50B435960D5}&la=}
 */
@Component({
    standalone: true,
    imports: [CommonModule, AccountMenuWidgetComponent, TrustAsHtmlPipe],
    selector: 'vn-am-text-widget',
    templateUrl: 'text-widget.html',
})
export class TextWidgetComponent extends AccountMenuItemBase implements OnInit {
    hideSkeleton: boolean = false;

    constructor(private trackingService: TrackingService) {
        super();
    }

    ngOnInit() {
        this.hideSkeleton = true;
        this.trackingService.trackEvents(this.item, WebAnalyticsEventType.load);
    }
}
