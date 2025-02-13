import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

import { DeviceService, TimerService, ViewTemplateForClient } from '@frontend/vanilla/core';
import { IconCustomComponent } from '@frontend/vanilla/features/icons';
import { ImageComponent } from '@frontend/vanilla/shared/image';
import { NotificationMessage, RtmsCtaAction, RtmsCtaActionTypes, RtmsLayerConfig } from '@frontend/vanilla/shared/rtms';

import { RtmsCtaActionComponent } from '../rtms-cta-action.component';

@Component({
    standalone: true,
    imports: [ImageComponent, RtmsCtaActionComponent, CommonModule, IconCustomComponent],
    selector: 'vn-rtms-toaster-item',
    templateUrl: 'rtms-toaster-item.html',
})
export class RtmsToasterItemComponent implements OnInit, OnDestroy {
    @Input() notification: NotificationMessage;
    @Input() messagesContent: ViewTemplateForClient;
    @Output() onClose: EventEmitter<string> = new EventEmitter<string>();

    private toastCloseTimeoutId: NodeJS.Timeout;
    private toastSwipeCloseTimeoutId: NodeJS.Timeout;

    constructor(
        private deviceService: DeviceService,
        private timer: TimerService,
        private config: RtmsLayerConfig,
        private elementRef: ElementRef,
    ) {}

    ngOnInit() {
        if (this.notification.content.toasterCloseAfterTimeout) {
            //set CSS property used for the animation on themes.
            this.elementRef.nativeElement.style.setProperty('--countdown-timer', `${this.config.toastShowTime}s`);

            this.toastCloseTimeoutId = this.timer.setTimeoutOutsideAngularZone(
                () => this.onClose.next(this.notification.id),
                this.config.toastShowTime * 1000,
            );
        }
    }

    ngOnDestroy() {
        this.timer.clearTimeout(this.toastCloseTimeoutId);
        this.timer.clearTimeout(this.toastSwipeCloseTimeoutId);
    }

    rtmsCtaActions(action: RtmsCtaAction, id: string): void {
        switch (action.type) {
            case RtmsCtaActionTypes.hideRtms:
                this.onClose.next(id);
                break;
        }
    }

    close(event: Event, id: string) {
        event.stopPropagation();
        this.onClose.next(id);
    }

    swipe(event: any, toaster: HTMLElement) {
        if (this.deviceService.isMobile) {
            const percentage = (100 * event.deltaX) / window.innerWidth;
            toaster.style.transform = 'translateX( ' + percentage + '% )';
        }
    }

    swipeEnd(event: any, toaster: HTMLElement, id: string) {
        if (this.deviceService.isMobile) {
            const percentage = (100 * event.deltaX) / window.innerWidth;

            if (Math.abs(percentage) > 30) {
                const endX = event.deltaX > 0 ? 100 : -100;
                const duration = 100;
                toaster.animate([{ transform: 'translateX(' + endX + '%)' }], duration);

                this.toastSwipeCloseTimeoutId = this.timer.setTimeout(() => this.close(event.srcEvent, id), duration);
            } else {
                toaster.style.transform = 'translateX(0)';
            }
        }
    }
}
