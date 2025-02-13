import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, input } from '@angular/core';

import { TrackingEventData } from '@frontend/vanilla/core';
import { Subject, takeUntil } from 'rxjs';

import { HeaderBarConfig } from './header-bar.client-config';
import { HeaderBarComponent } from './header-bar.component';
import { HeaderBarService } from './header-bar.service';

/**
 * @whatItDoes Shows header title bar, optionally with close and back button.
 * Close button is enabled by default.
 * If callback @onClose is specified calls it. If not, if user is in workflow, logs out the user and redirects to last known product. If user is not in workflow, redirects to last known product.
 * Back button is disabled by default. It can be enabled.
 *  @stable
 */
@Component({
    standalone: true,
    imports: [HeaderBarComponent, CommonModule],
    selector: 'lh-header-bar',
    templateUrl: 'header-bar.component.html',
})
export class LhHeaderBarComponent implements OnInit, OnDestroy {
    /** Specifies if header bar is enabled */
    @Input() enabled?: boolean;
    /** Specifies if back button should be shown */
    @Input() showBackButton: boolean;
    /** Specifies if close button should be disabled */
    @Input() disableClose: boolean;
    /** Specifies title/content */
    @Input() content: string;
    /** CSS class passed to underlying vn-header-bar */
    @Input() titleCssClass: string;
    /** CSS class set on underlying vn-header-bar tag */
    @Input() headerCssClass: string;
    /** Specifies back button text passed to underlying vn-header-bar */
    @Input() backButtonText: string;
    /** Show close button as text */
    @Input() closeButtonText: string;
    /** CSS class set on underlying close text */
    @Input() closeButtonTextCssClass: string;
    /** CSS class set on underlying vn-header-bar left content section */
    @Input() leftContentClass: string;
    /** Indicates if confirmation popup should be shown when leaving the page */
    showConfirmPopup = input<boolean>(false);
    /** Data to be tracked when confirm popup is opened */
    confirmPopupTrackLoad = input<TrackingEventData>();
    /** Data to be tracked when button is clicked in confirm popup */
    confirmPopupTrackClick = input<TrackingEventData>();
    /** Data to be tracked when back is clicked */
    trackBackClickEvent = input<TrackingEventData>();
    /** Data to be tracked when close is clicked */
    trackCloseClickEvent = input<TrackingEventData>();
    /** Specifies callback when close button is clicked */
    @Output() onClose: EventEmitter<any> = new EventEmitter();
    /** Specifies callback when back button is clicked */
    @Output() onBack: EventEmitter<any> = new EventEmitter();

    private unsubscribe = new Subject<void>();

    constructor(
        private headerBarService: HeaderBarService,
        public config: HeaderBarConfig,
    ) {}

    ngOnInit(): void {
        if (this.disableClose === undefined) {
            this.headerBarService.disableClose$.pipe(takeUntil(this.unsubscribe)).subscribe((disableClose) => {
                this.disableClose = disableClose;
            });
        }
        if (this.showBackButton === undefined) {
            this.headerBarService.showBackButton$.pipe(takeUntil(this.unsubscribe)).subscribe((showBackButton) => {
                this.showBackButton = showBackButton;
            });
        }
    }

    close() {
        if (this.onClose.observers.length > 0) {
            this.onClose.emit();
            return;
        }

        this.headerBarService.close();
        return;
    }

    back() {
        if (this.onBack.observers.length > 0) {
            this.onBack.emit();
            return;
        }

        this.headerBarService.back();
    }

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }
}
