import { OverlayModule, OverlayRef } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';

import { MenuContentItem, TrackingService, trackByProp } from '@frontend/vanilla/core';

import { UserSummaryItemComponent } from './user-summary-item.component';
import { UserSummaryConfig } from './user-summary.client-config';

@Component({
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [UserSummaryItemComponent, CommonModule, OverlayModule],
    selector: 'vn-user-summary-overlay',
    templateUrl: 'user-summary-overlay.html',
})
export class UserSummaryOverlayComponent implements OnInit {
    readonly trackByText = trackByProp<MenuContentItem>('text');
    content = signal<UserSummaryConfig>(this.config);

    constructor(
        private overlayRef: OverlayRef,
        private config: UserSummaryConfig,
        private trackingService: TrackingService,
    ) {
        this.content().summaryItems.sort((a, b) => {
            if (a.parameters?.['order'] && b.parameters?.['order']) {
                return a.parameters['order'] > b.parameters['order'] ? 1 : a.parameters?.['order'] === b.parameters?.['order'] ? 0 : -1;
            }
            return 0;
        });
    }

    ngOnInit(): void {
        this.trackEvent('contentView', 'load', 'not applicable', 'transaction monthly summary interceptor');
    }

    close() {
        this.trackEvent('Event.Tracking', 'click', 'transaction monthly summary interceptor', 'ok');
        this.overlayRef.detach();
    }

    private trackEvent(eventName: string, actionEvent: string, locationEvent: string, eventDetails: string) {
        this.trackingService.triggerEvent(eventName, {
            'component.CategoryEvent': 'transaction summary',
            'component.LabelEvent': 'monthly summary',
            'component.ActionEvent': actionEvent,
            'component.PositionEvent': 'not applicable',
            'component.LocationEvent': locationEvent,
            'component.EventDetails': eventDetails,
            'component.URLClicked': 'not applicable',
        });
    }
}
