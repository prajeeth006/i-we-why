import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';

import { DynamicHtmlDirective, MenuContentItem, TrackingService, trackByProp } from '@frontend/vanilla/core';
import { IconCustomComponent } from '@frontend/vanilla/features/icons';
import { TrustAsHtmlPipe } from '@frontend/vanilla/shared/browser';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ProfilePageNudgesService } from './profile-page-nudges.service';

@Component({
    standalone: true,
    imports: [CommonModule, TrustAsHtmlPipe, DynamicHtmlDirective, IconCustomComponent],
    selector: 'vn-profile-page-nudges',
    templateUrl: 'profile-page-nudges.html',
})
export class ProfilePageNudgesComponent implements OnInit, OnDestroy {
    items: MenuContentItem[] = [];
    private unsubscribe = new Subject<void>();
    readonly trackByText = trackByProp<MenuContentItem>('text');

    constructor(
        private profilePageNudgesService: ProfilePageNudgesService,
        private trackingService: TrackingService,
    ) {}
    ngOnInit() {
        this.profilePageNudgesService.displayItems.pipe(takeUntil(this.unsubscribe)).subscribe((items) => {
            this.items = items;
        });

        this.trackingService.triggerEvent('contentView', {
            'component.CategoryEvent': 'my profile',
            'component.LabelEvent': 'my hub',
            'component.ActionEvent': 'load',
            'component.PositionEvent': 'not applicable',
            'component.LocationEvent': 'my hub page',
            'component.EventDetails': 'dotted learning & onboarding section',
            'component.URLClicked': 'not applicable',
        });
    }

    hide(item: MenuContentItem) {
        this.profilePageNudgesService.hide(item);
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }
}
