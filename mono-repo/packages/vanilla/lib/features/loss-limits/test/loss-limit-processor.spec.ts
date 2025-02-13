import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { EventType, RtmsMessage } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { LossLimitsProcessor } from '../src/loss-limit-processor';
import { LossLimitsConfigMock, LossLimitsOverlayServiceMock } from './loss-limits.mock';

describe('LossLimitsProcessor', () => {
    let service: LossLimitsProcessor;
    let lossLimitsOverlayService: LossLimitsOverlayServiceMock;
    let lossLimitsConfigMock: LossLimitsConfigMock;

    beforeEach(() => {
        lossLimitsOverlayService = MockContext.useMock(LossLimitsOverlayServiceMock);
        lossLimitsConfigMock = MockContext.useMock(LossLimitsConfigMock);

        TestBed.configureTestingModule({
            providers: [LossLimitsProcessor, MockContext.providers],
        });
        service = TestBed.inject(LossLimitsProcessor);
    });

    function init(message: RtmsMessage) {
        service.process({ type: EventType.Rtms, name: message.eventId, data: message.payload });
        lossLimitsConfigMock.whenReady.next();
        tick();
    }

    ['LOSS_LIMIT_WARN', 'LOSS_LIMIT_REACHED'].forEach((type: string) => {
        it(`should show overlay when ${type} message with daily limit data is received`, fakeAsync(() => {
            init({
                type,
                eventId: '123',
                payload: {
                    DAILY_LIMIT: {
                        playerLimitAmount: 10,
                        totalLossAmount: 8,
                        pendingLossAmount: 2,
                        currency: 'JPY',
                        isMandatory: true,
                    },
                },
            });

            expect(lossLimitsOverlayService.show).toHaveBeenCalledWith([
                {
                    notificationType: 'DAILY_LIMIT',
                    playerLimitAmount: 10,
                    totalLossAmount: 8,
                    pendingLossAmount: 2,
                    currency: 'JPY',
                    usedPercentage: 80,
                    isMandatory: true,
                },
            ]);
        }));
    });

    ['LOSS_LIMIT_WARN', 'LOSS_LIMIT_REACHED'].forEach((type: string) => {
        it(`should show overlay when ${type} message with daily and weekly limits data is received`, fakeAsync(() => {
            init({
                type,
                eventId: '123',
                payload: {
                    DAILY_LIMIT: {
                        playerLimitAmount: 10,
                        totalLossAmount: 8,
                        pendingLossAmount: 2,
                        currency: 'JPY',
                        isMandatory: false,
                    },
                    WEEKLY_LIMIT: {
                        playerLimitAmount: 100,
                        totalLossAmount: 81,
                        pendingLossAmount: 19,
                        currency: 'JPY',
                        isMandatory: true,
                    },
                },
            });

            expect(lossLimitsOverlayService.show).toHaveBeenCalledWith([
                {
                    notificationType: 'DAILY_LIMIT',
                    playerLimitAmount: 10,
                    totalLossAmount: 8,
                    pendingLossAmount: 2,
                    currency: 'JPY',
                    usedPercentage: 80,
                    isMandatory: false,
                },
                {
                    notificationType: 'WEEKLY_LIMIT',
                    playerLimitAmount: 100,
                    totalLossAmount: 81,
                    pendingLossAmount: 19,
                    currency: 'JPY',
                    usedPercentage: 81,
                    isMandatory: true,
                },
            ]);
        }));
    });

    ['LOSS_LIMIT_WARN', 'LOSS_LIMIT_REACHED'].forEach((type: string) => {
        it(`should show when ${type} message with daily and weekly and monthly limit data is received`, fakeAsync(() => {
            init({
                type,
                eventId: '123',
                payload: {
                    DAILY_LIMIT: {
                        playerLimitAmount: 10,
                        totalLossAmount: 8,
                        pendingLossAmount: 2,
                        currency: 'JPY',
                        isMandatory: false,
                    },
                    WEEKLY_LIMIT: {
                        playerLimitAmount: 100,
                        totalLossAmount: 81,
                        pendingLossAmount: 19,
                        currency: 'JPY',
                        isMandatory: false,
                    },
                    MONTHLY_LIMIT: {
                        playerLimitAmount: 200,
                        totalLossAmount: 162,
                        pendingLossAmount: 38,
                        currency: 'JPY',
                        isMandatory: true,
                    },
                },
            });

            expect(lossLimitsOverlayService.show).toHaveBeenCalledWith([
                {
                    notificationType: 'DAILY_LIMIT',
                    playerLimitAmount: 10,
                    totalLossAmount: 8,
                    pendingLossAmount: 2,
                    currency: 'JPY',
                    usedPercentage: 80,
                    isMandatory: false,
                },
                {
                    notificationType: 'WEEKLY_LIMIT',
                    playerLimitAmount: 100,
                    totalLossAmount: 81,
                    pendingLossAmount: 19,
                    currency: 'JPY',
                    usedPercentage: 81,
                    isMandatory: false,
                },
                {
                    notificationType: 'MONTHLY_LIMIT',
                    playerLimitAmount: 200,
                    totalLossAmount: 162,
                    pendingLossAmount: 38,
                    currency: 'JPY',
                    usedPercentage: 81,
                    isMandatory: true,
                },
            ]);
        }));
    });

    ['LOSS_LIMIT_WARN', 'LOSS_LIMIT_REACHED'].forEach((type: string) => {
        it('should not show overlay when the feature is enabled but no isMandatory message with daily, weekly or monthly limit data is received', fakeAsync(() => {
            init({
                type,
                eventId: '123',
                payload: {
                    DAILY_LIMIT: {
                        playerLimitAmount: 10,
                        totalLossAmount: 8,
                        pendingLossAmount: 2,
                        currency: 'JPY',
                        isMandatory: false,
                    },
                    WEEKLY_LIMIT: {
                        playerLimitAmount: 100,
                        totalLossAmount: 81,
                        pendingLossAmount: 19,
                        currency: 'JPY',
                        isMandatory: false,
                    },
                    MONTHLY_LIMIT: {
                        playerLimitAmount: 200,
                        totalLossAmount: 162,
                        pendingLossAmount: 38,
                        currency: 'JPY',
                        isMandatory: false,
                    },
                },
            });

            expect(lossLimitsOverlayService.show).not.toHaveBeenCalled();
        }));
    });
});
