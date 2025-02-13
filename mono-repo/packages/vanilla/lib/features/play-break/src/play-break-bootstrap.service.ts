import { Injectable } from '@angular/core';

import {
    DynamicLayoutService,
    EventsService,
    LocalStoreKey,
    LocalStoreService,
    OnFeatureInit,
    RtmsMessage,
    RtmsService,
    RtmsType,
    SlotName,
    ToastrQueueService,
    ToastrType,
    VanillaEventNames,
} from '@frontend/vanilla/core';
import { firstValueFrom } from 'rxjs';
import { filter } from 'rxjs/operators';

import { PlayBreakOverlayService } from './play-break-overlay.service';
import { PlayBreakTimerComponent } from './play-break-timer.component';
import { PlayBreakConfig } from './play-break.client-config';
import { PlayBreak, PlayBreakNotification, PlayBreakType } from './play-break.models';
import { PlayBreakService } from './play-break.service';

@Injectable()
export class PlayBreakBootstrapService implements OnFeatureInit {
    constructor(
        private config: PlayBreakConfig,
        private rtmsService: RtmsService,
        private playBreakOverlayService: PlayBreakOverlayService,
        private playBreakService: PlayBreakService,
        private toastrQueueService: ToastrQueueService,
        private dynamicLayoutService: DynamicLayoutService,
        private eventsService: EventsService,
        private localStorageService: LocalStoreService,
    ) {}

    async onFeatureInit() {
        await firstValueFrom(this.config.whenReady);

        this.dynamicLayoutService.addComponent(SlotName.HeaderTopItems, PlayBreakTimerComponent, {});

        this.playBreakService.playBreak.pipe(filter(Boolean)).subscribe((playBreak: PlayBreak) => {
            if (playBreak.gracePeriod) {
                this.playBreakService.startPlayBreakTimer({
                    event: RtmsType.PLAY_BREAK_GRACE_PERIOD_EVENT,
                    playBreakInGc: playBreak.playBreakOpted,
                    endTime: new Date(playBreak.gracePeriodEndTime),
                });
                this.storeBreakType(playBreak.playBreakType);
            } else if (playBreak.playBreak) {
                this.playBreakService.startPlayBreakTimer({
                    event: RtmsType.PLAY_BREAK_START_EVENT,
                    playBreakInGc: playBreak.playBreakOpted,
                    endTime: new Date(playBreak.playBreakEndTime),
                });
                this.storeBreakType(playBreak.playBreakType);
            }

            this.eventsService.raise({ eventName: VanillaEventNames.PlayBreak, data: playBreak });

            if (playBreak.playBreak) {
                this.toastrQueueService.add(playBreak.playBreakOpted ? ToastrType.PlayBreakActive : ToastrType.PlayBreakActiveLongSession);
            }
        });

        this.playBreakService.load();

        this.rtmsService.messages
            .pipe(
                filter(
                    (message: RtmsMessage) =>
                        message.type === RtmsType.PLAY_BREAK_GRACE_PERIOD_EVENT ||
                        message.type === RtmsType.PLAY_BREAK_START_EVENT ||
                        message.type === RtmsType.LONG_SESSION_INTERACTION_EVENT ||
                        message.type === RtmsType.LONG_SESSION_24H_INTERACTION_EVENT,
                ),
            )
            .subscribe((message: RtmsMessage) => {
                const payload = message.payload as PlayBreakNotification;

                switch (message.type) {
                    case RtmsType.PLAY_BREAK_GRACE_PERIOD_EVENT:
                        this.handlePlayBreakGracePeriodEvent(payload);
                        break;
                    case RtmsType.LONG_SESSION_INTERACTION_EVENT:
                        this.playBreakOverlayService.showBreakConfig(payload);
                        break;
                    case RtmsType.LONG_SESSION_24H_INTERACTION_EVENT:
                        payload.breakType = PlayBreakType.LONG_SESSION_24H_BREAK;
                        this.playBreakOverlayService.showBreakConfig(payload);
                        break;
                    case RtmsType.PLAY_BREAK_START_EVENT:
                        this.playBreakOverlayService.showSoftBreak(payload);
                        this.playBreakService.startPlayBreakTimer({
                            event: RtmsType.PLAY_BREAK_START_EVENT,
                            playBreakInGc: payload?.playBreakInGC === 'Y',
                            endTime: new Date(message.payload.playBreakEndTime),
                        });
                        this.storeBreakType(message.payload.breakType);
                        break;
                }
            });
    }

    private storeBreakType(breakType: string) {
        this.localStorageService.set(LocalStoreKey.PlayBreakType, breakType === PlayBreakType.LONG_SESSION_24H_BREAK ? '24h' : '');
    }

    private handlePlayBreakGracePeriodEvent(payload: PlayBreakNotification) {
        const playBreakInGc = payload?.playBreakInGC === 'Y';

        this.playBreakService.startPlayBreakTimer({
            event: RtmsType.PLAY_BREAK_GRACE_PERIOD_EVENT,
            playBreakInGc,
            endTime: new Date(new Date().getTime() + (payload.graceEndTime || 0) * 60000),
        });
        this.storeBreakType(payload.breakType || '');

        const isMandatoryBreak = payload.isPlayBreakOpted === 'N';

        if (isMandatoryBreak) {
            this.playBreakOverlayService.showMandatoryBreak(payload);
        }

        this.toastrQueueService.add(playBreakInGc ? ToastrType.PlayBreakGracePeriod : ToastrType.PlayBreakGracePeriodLongSession, {
            placeholders: {
                graceDuration: payload.graceEndTime?.toString() || '',
                interceptor: isMandatoryBreak ? 'hard interceptor' : 'soft interceptor',
            },
        });
    }
}
