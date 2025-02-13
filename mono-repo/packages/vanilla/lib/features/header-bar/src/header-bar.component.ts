import { CommonModule } from '@angular/common';
import { Component, DestroyRef, EventEmitter, Input, OnInit, Output, inject, input } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { EventsService, SimpleEvent, TrackingEventData, TrackingService, VanillaEventNames } from '@frontend/vanilla/core';
import { IconCustomComponent } from '@frontend/vanilla/features/icons';
import { ConfirmPopupService } from '@frontend/vanilla/shared/confirm-popup';
import { filter } from 'rxjs/operators';

import { ConfirmPopupAction } from './header-bar.models';
import { HeaderBarService } from './header-bar.service';

/**
 * @whatItDoes Display a header bar with a title and close/back buttons.
 *
 * @howToUse
 *
 * ```
 * <vn-header-bar [title]="someTitle" (onBack)="back()" (onClose)="close()" />
 * ```
 *
 * @stable
 */
@Component({
    standalone: true,
    imports: [CommonModule, IconCustomComponent],
    selector: 'vn-header-bar',
    templateUrl: 'header-bar.html',
})
export class HeaderBarComponent implements OnInit {
    @Input() title: string;
    @Input() titleCssClass: string;
    @Input() showBack?: boolean;
    @Input() showClose?: boolean;
    @Input() enabled?: boolean;
    @Input() backButtonText: string;
    @Input() closeButtonText: string;
    @Input() leftContentClass: string;
    @Input() closeButtonTextCssClass: string;
    showConfirmPopup = input<boolean>(false);
    confirmPopupTrackLoad = input<TrackingEventData>();
    confirmPopupTrackClick = input<TrackingEventData>();
    trackBackClickEvent = input<TrackingEventData>();
    trackCloseClickEvent = input<TrackingEventData>();
    @Output() onBack: EventEmitter<void> = new EventEmitter<void>();
    @Output() onClose: EventEmitter<void> = new EventEmitter<void>();

    private readonly headerBarService = inject(HeaderBarService);
    private readonly confirmPopupService = inject(ConfirmPopupService);
    private readonly eventsService = inject(EventsService);
    private readonly trackingService = inject(TrackingService);
    private readonly destroyRef = inject(DestroyRef);

    ngOnInit() {
        if (this.enabled === undefined) {
            this.headerBarService.enabled$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((enabled) => {
                // if this component is turned into an OnPush component, we probably need cdRef#markForCheck here
                this.enabled = enabled;
            });
        }
        this.eventsService.newEvents
            .pipe(
                takeUntilDestroyed(this.destroyRef),
                filter((e: SimpleEvent) => e.eventName === VanillaEventNames.ConfirmPopupLeaveButton),
            )
            .subscribe((e: SimpleEvent) => {
                switch (e.data?.action) {
                    case ConfirmPopupAction.Close:
                        this.onClose.emit();
                        break;
                    case ConfirmPopupAction.Back:
                        this.onBack.emit();
                        break;
                }
            });
    }

    onBackClick() {
        this.triggerEvent(this.trackBackClickEvent());
        this.showPopupOrEmit(this.onBack, ConfirmPopupAction.Back);
    }

    onCloseClick() {
        this.triggerEvent(this.trackCloseClickEvent());
        this.showPopupOrEmit(this.onClose, ConfirmPopupAction.Close);
    }

    private showPopupOrEmit(emitter: EventEmitter<void>, action: ConfirmPopupAction) {
        if (this.showConfirmPopup()) {
            const options = { action, trackingDataLoad: this.confirmPopupTrackLoad(), trackingDataClick: this.confirmPopupTrackClick() };
            this.confirmPopupService.show(options);
        } else {
            emitter.emit();
        }
    }

    private triggerEvent(trackData?: TrackingEventData) {
        if (trackData) {
            this.trackingService.triggerEvent(trackData.eventName, trackData.data);
        }
    }
}
