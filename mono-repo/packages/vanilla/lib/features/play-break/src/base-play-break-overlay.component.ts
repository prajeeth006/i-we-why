import { OverlayRef } from '@angular/cdk/overlay';
import { Directive, Signal, computed, input } from '@angular/core';

import { TimeSpan } from '@frontend/vanilla/core';

import { PlayBreakNotification, PlayBreakType } from './play-break.models';
import { PlayBreakService } from './play-break.service';

@Directive()
export abstract class BasePlayBreakOverlayComponent {
    protected readonly notification = input<PlayBreakNotification>({ cstEventId: '' });
    protected readonly playBreakInGc = computed<boolean>(() => this.notification().playBreakInGC === 'Y');
    protected readonly breakType = computed<string>(() => (this.notification().breakType === PlayBreakType.LONG_SESSION_24H_BREAK ? '24h' : ''));
    protected readonly isPlayBreakSet = computed<boolean>(() => this.notification().isPlayBreakOpted === 'Y');

    protected constructor(
        public playBreakService: PlayBreakService,
        private overlayRef: OverlayRef,
    ) {}

    protected getSelectedPlayBreakDuration(validation?: { [key: string]: string }): Signal<string> {
        const startTime = this.notification().playBreakStartTime;
        const endTime = this.notification().playBreakEndTime;

        if (startTime && endTime) {
            return computed(() => this.playBreakService.formatTime(new TimeSpan(endTime - startTime), validation));
        }

        return computed(() => this.playBreakService.formatTime(TimeSpan.fromMinutes(this.notification().selectedPlayBreakDuration || 0), validation));
    }

    protected getSelectedPlayBreakStart(validation?: { [key: string]: string }): Signal<string> {
        return computed(() => this.playBreakService.formatTime(TimeSpan.fromMinutes(this.notification().selectedPlayBreakStart || 0), validation));
    }

    protected getGraceEndTime(validation?: { [key: string]: string }): Signal<string> {
        return computed(() => this.playBreakService.formatTime(TimeSpan.fromMinutes(this.notification().graceEndTime || 0), validation));
    }

    protected closeOverlay() {
        this.overlayRef.detach();
    }
}
