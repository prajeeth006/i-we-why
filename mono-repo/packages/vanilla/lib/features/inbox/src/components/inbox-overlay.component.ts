import { OverlayRef } from '@angular/cdk/overlay';
import { Component, Inject, InjectionToken, OnDestroy, OnInit } from '@angular/core';

import { NavigationService } from '@frontend/vanilla/core';
import { Subscription } from 'rxjs';

import { InboxComponent } from './inbox.component';

export interface InboxData {
    showBackButton: boolean;
}

export const INBOX_DATA = new InjectionToken<InboxData>('vn-inbox-data');
@Component({
    standalone: true,
    imports: [InboxComponent],
    selector: 'vn-inbox-overlay',
    templateUrl: 'inbox-overlay.html',
})
export class InboxOverlayComponent implements OnInit, OnDestroy {
    showBackButton: boolean;
    private locationChangeSubscription: Subscription;
    constructor(
        @Inject(INBOX_DATA) private inboxData: InboxData,
        private overlayRef: OverlayRef,
        private navigationService: NavigationService,
    ) {}

    ngOnInit() {
        this.showBackButton = this.inboxData.showBackButton;
        this.locationChangeSubscription = this.navigationService.locationChange.subscribe(() => {
            this.overlayRef.detach();
        });
    }
    ngOnDestroy(): void {
        if (this.locationChangeSubscription) {
            this.locationChangeSubscription.unsubscribe();
        }
    }
}
