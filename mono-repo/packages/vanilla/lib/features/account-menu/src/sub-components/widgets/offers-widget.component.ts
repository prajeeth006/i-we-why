import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';

import { TrackingService } from '@frontend/vanilla/core';
import { OffersService } from '@frontend/vanilla/shared/offers';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AccountMenuItemBase } from '../../account-menu-item-base';
import { AccountMenuTrackingService } from '../../account-menu-tracking.service';
import { AccountMenuWidgetComponent } from './widget.component';

@Component({
    standalone: true,
    imports: [CommonModule, AccountMenuWidgetComponent],
    selector: 'vn-am-offers-widget',
    templateUrl: 'offers-widget.html',
})
export class OffersWidgetComponent extends AccountMenuItemBase implements OnInit, OnDestroy {
    text: string;
    description: string;
    isFirstNotification: boolean = true;
    hideSkeleton: boolean = false;

    private unsubscribe = new Subject<void>();

    constructor(
        private offers: OffersService,
        private accountMenuTrackingService: AccountMenuTrackingService,
        private trackingService: TrackingService,
    ) {
        super();
    }

    ngOnInit() {
        // track component loaded without the offers indicator
        this.trackingService.trackContentItemEvent(this.item.trackEvent, 'LoadedEvent');
        this.description = this.item?.resources['NoOffersDescription'] || '';
        this.offers.counts.pipe(takeUntil(this.unsubscribe)).subscribe(() => {
            const count = this.offers.getCount('ALL');
            this.text = count ? this.item?.resources['Text']!.replace('{COUNT}', (count || 0).toString()) || '' : '';
            this.description = (count ? this.item?.resources['Description'] : this.item?.resources['NoOffersDescription']) || '';
            const placeholders = { 'component.PositionEvent': count ? 'new offers' : 'no offer' };
            this.accountMenuTrackingService.replacePlaceholders(this.item, placeholders);
            this.hideSkeleton = true;
            // track component is loaded only on first notification
            if (this.isFirstNotification) {
                this.isFirstNotification = false;
                // track component loaded with the offers indicator
                this.trackingService.trackContentItemEvent(this.item.trackEvent, 'LoadedEvent');
            }
        });
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }
}
