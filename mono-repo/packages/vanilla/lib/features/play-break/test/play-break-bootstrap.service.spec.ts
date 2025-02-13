import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { RtmsType, SlotName, TimeSpan, VanillaEventNames } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { EventsServiceMock } from '../../../core/src/utils/test/utils.mock';
import { LocalStoreServiceMock } from '../../../core/test/browser/local-store.mock';
import { DynamicLayoutServiceMock } from '../../../core/test/dynamic-layout/dynamic-layout.mock';
import { ToastrQueueServiceMock } from '../../../core/test/toastr/toastr-queue.mock';
import { RtmsServiceMock } from '../../../shared/rtms/test/stubs/rtms-mocks';
import { PlayBreakBootstrapService } from '../src/play-break-bootstrap.service';
import { PlayBreakTimerComponent } from '../src/play-break-timer.component';
import { PlayBreak, PlayBreakNotification, PlayBreakType } from '../src/play-break.models';
import { PlayBreakConfigMock, PlayBreakOverlayServiceMock, PlayBreakServiceMock } from './play-break.mocks';

describe('PlayBreakBootstrapService', () => {
    let service: PlayBreakBootstrapService;
    let playBreakConfigMock: PlayBreakConfigMock;
    let rtmsServiceMock: RtmsServiceMock;
    let playBreakOverlayServiceMock: PlayBreakOverlayServiceMock;
    let playBreakServiceMock: PlayBreakServiceMock;
    let toastrQueueServiceMock: ToastrQueueServiceMock;
    let dynamicLayoutServiceMock: DynamicLayoutServiceMock;
    let eventsServiceMock: EventsServiceMock;
    let playBreak: PlayBreak;
    let playBreakNotification: PlayBreakNotification;

    function sendRtmsMessage(type: string) {
        rtmsServiceMock.messages.next({
            eventId: '123',
            type,
            payload: playBreakNotification,
        });
    }

    beforeEach(() => {
        playBreakConfigMock = MockContext.useMock(PlayBreakConfigMock);
        rtmsServiceMock = MockContext.useMock(RtmsServiceMock);
        playBreakOverlayServiceMock = MockContext.useMock(PlayBreakOverlayServiceMock);
        playBreakServiceMock = MockContext.useMock(PlayBreakServiceMock);
        toastrQueueServiceMock = MockContext.useMock(ToastrQueueServiceMock);
        dynamicLayoutServiceMock = MockContext.useMock(DynamicLayoutServiceMock);
        eventsServiceMock = MockContext.useMock(EventsServiceMock);
        MockContext.useMock(LocalStoreServiceMock);

        TestBed.configureTestingModule({
            providers: [PlayBreakBootstrapService, MockContext.providers],
        });

        playBreak = {
            playBreak: false,
            playBreakType: PlayBreakType.PLAY_BREAK,
            playBreakEndTime: '2021-01-01',
            gracePeriodEndTime: '2021-01-01',
            gracePeriod: false,
            playBreakOpted: false,
        };

        playBreakNotification = {
            cstEventId: '123',
            breakType: PlayBreakType.PLAY_BREAK,
            isPlayBreakOpted: 'N',
            selectedPlayBreakDuration: 30, // In minutes
            selectedPlayBreakStart: 5, // In minutes
            playBreakStartTime: TimeSpan.fromMinutes(2).totalMilliseconds,
            graceEndTime: 30, // In minutes
            playBreakEndTime: TimeSpan.fromMinutes(4).totalMilliseconds,
            playBreakInGC: 'Y', // Obsolete
        };

        service = TestBed.inject(PlayBreakBootstrapService);
    });

    describe('onFeatureInit', () => {
        beforeEach(fakeAsync(() => {
            service.onFeatureInit();
            playBreakConfigMock.whenReady.next();
            tick();
        }));

        it('should load play break data and add timer component in the header top items', () => {
            expect(playBreakServiceMock.load).toHaveBeenCalled();
            expect(dynamicLayoutServiceMock.addComponent).toHaveBeenCalledWith(SlotName.HeaderTopItems, PlayBreakTimerComponent, {});
        });

        describe('on play break load', () => {
            it('should start play break timer with grace period', () => {
                playBreak.gracePeriod = true;
                playBreakServiceMock.playBreak.next(playBreak);

                expect(playBreakServiceMock.startPlayBreakTimer).toHaveBeenCalledOnceWith({
                    event: RtmsType.PLAY_BREAK_GRACE_PERIOD_EVENT,
                    playBreakInGc: playBreak.playBreakOpted,
                    endTime: new Date(playBreak.gracePeriodEndTime),
                });
            });

            it('should start play break timer', () => {
                playBreak.playBreak = true;
                playBreakServiceMock.playBreak.next(playBreak);

                expect(playBreakServiceMock.startPlayBreakTimer).toHaveBeenCalledOnceWith({
                    event: RtmsType.PLAY_BREAK_START_EVENT,
                    playBreakInGc: playBreak.playBreakOpted,
                    endTime: new Date(playBreak.playBreakEndTime),
                });
            });

            it('should raise CCB event', () => {
                playBreakServiceMock.playBreak.next(playBreak);

                expect(eventsServiceMock.raise).toHaveBeenCalledOnceWith({ eventName: VanillaEventNames.PlayBreak, data: playBreak });
            });

            it('should add toastr', () => {
                playBreak.playBreak = true;
                playBreakServiceMock.playBreak.next(playBreak);

                expect(toastrQueueServiceMock.add).toHaveBeenCalledWith('playbreakactivelongsession');

                playBreak.playBreakOpted = true;
                playBreakServiceMock.playBreak.next(playBreak);

                expect(toastrQueueServiceMock.add).toHaveBeenCalledWith('playbreakactive');
            });
        });

        describe('on RTMS message', () => {
            it('should handle play break grace period on PLAY_BREAK_GRACE_PERIOD_EVENT', () => {
                sendRtmsMessage(RtmsType.PLAY_BREAK_GRACE_PERIOD_EVENT);

                expect(playBreakServiceMock.startPlayBreakTimer).toHaveBeenCalledOnceWith({
                    event: RtmsType.PLAY_BREAK_GRACE_PERIOD_EVENT,
                    playBreakInGc: true,
                    endTime: jasmine.any(Date),
                });
                expect(playBreakOverlayServiceMock.showMandatoryBreak).toHaveBeenCalledOnceWith(playBreakNotification);
                expect(toastrQueueServiceMock.add).toHaveBeenCalledOnceWith('playbreakgraceperiod', {
                    placeholders: {
                        graceDuration: '30',
                        interceptor: 'hard interceptor',
                    },
                });
            });

            it('should show break config on LONG_SESSION_INTERACTION_EVENT', () => {
                sendRtmsMessage(RtmsType.LONG_SESSION_INTERACTION_EVENT);

                expect(playBreakOverlayServiceMock.showBreakConfig).toHaveBeenCalledOnceWith(playBreakNotification);
            });

            it('should show break config on PLAY_BREAK_START_EVENT', () => {
                sendRtmsMessage(RtmsType.PLAY_BREAK_START_EVENT);

                expect(playBreakOverlayServiceMock.showSoftBreak).toHaveBeenCalledOnceWith(playBreakNotification);
                expect(playBreakServiceMock.startPlayBreakTimer).toHaveBeenCalledOnceWith({
                    event: RtmsType.PLAY_BREAK_START_EVENT,
                    playBreakInGc: true,
                    endTime: new Date(playBreakNotification.playBreakEndTime!),
                });
            });
        });
    });
});
