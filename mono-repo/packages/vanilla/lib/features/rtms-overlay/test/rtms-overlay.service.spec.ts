import { OverlayRef } from '@angular/cdk/overlay';
import { TestBed } from '@angular/core/testing';

import { RtmsType } from '@frontend/vanilla/core';
import { NotificationMessageWithType, RtmsMessageEx } from '@frontend/vanilla/shared/rtms';
import { MockContext } from 'moxxi';

import { AppInfoConfigMock } from '../../../core/src/client-config/test/app-info-config.mock';
import { RtmsCommonServiceMock } from '../../../core/src/rtms/test/rtms.mocks';
import { RtmsOverlayService } from '../../../features/rtms-overlay/src/rtms-overlay.service';
import { OverlayFactoryMock } from '../../../shared/overlay-factory/test/overlay-factory.mock';
import { RtmsClientConfigMock, RtmsLayerNotificationQueueMock } from '../../../shared/rtms/test/stubs/rtms-mocks';

const rtmsTestMessage: RtmsMessageEx = {
    eventInfo: { messageType: 'OVERLAY', campaignId: '27700' },
    destinationUserName: 'johnsnow',
    messageId: 'Id',
    type: RtmsType.OVERLAY,
    eventId: '123',
    payload: {
        campaignId: '27700',
        notificationType: 'OVERLAY',
        accountName: 'bzinboxcta3',
        baseTemplateId: '/id/0205b25f-9485-4684-9476-1513b6aa539b',
        baseTempletId: '/id/0205b25f-9485-4684-9476-1513b6aa539b',
        applicableProducts: ['SPORTSBOOK', 'CASINO', 'BINGO', 'BETTING', 'POKER'],
        offerTypes: ['BONUS_OFFER'],
        additionalInfo: {},
    },
};

describe('RtmsOverlayService', () => {
    let service: RtmsOverlayService;
    let appInfoConfig: AppInfoConfigMock;
    let overlayFactory: OverlayFactoryMock;
    let config: RtmsClientConfigMock;
    let rtmsCommonService: RtmsCommonServiceMock;
    let rtmsNotificationQueue: RtmsLayerNotificationQueueMock;

    beforeEach(() => {
        overlayFactory = MockContext.useMock(OverlayFactoryMock);
        config = MockContext.useMock(RtmsClientConfigMock);
        rtmsCommonService = MockContext.useMock(RtmsCommonServiceMock);
        rtmsNotificationQueue = MockContext.useMock(RtmsLayerNotificationQueueMock);
        appInfoConfig = MockContext.useMock(AppInfoConfigMock);
        TestBed.configureTestingModule({
            providers: [MockContext.providers, RtmsOverlayService],
        });
        service = TestBed.inject(RtmsOverlayService);
    });

    describe('init', () => {
        it('should process message when receiving new rtms message', () => {
            service.init();
            rtmsNotificationQueue.newMsObserver.next(rtmsTestMessage);
            expect(rtmsCommonService.processMessage).toHaveBeenCalled();
        });

        it('should not process message when already open overlayRef and type is OVERLAY', () => {
            service.currentRef = {} as OverlayRef;
            service.init();
            rtmsNotificationQueue.newMsObserver.next(rtmsTestMessage);
            expect(rtmsCommonService.processMessage).not.toHaveBeenCalled();
        });

        it('should process message when already open overlayRef and type TOASTER with enable stacking true', () => {
            service.currentRef = {} as OverlayRef;
            rtmsTestMessage.type = RtmsType.TOASTER;
            config.enableToastStacking = true;
            service.init();
            rtmsNotificationQueue.newMsObserver.next(rtmsTestMessage);
            expect(rtmsCommonService.processMessage).toHaveBeenCalled();
        });

        it('should not process message when already open overlayRef and type TOASTER with enable stacking false;', () => {
            service.currentRef = {} as OverlayRef;
            rtmsTestMessage.type = RtmsType.TOASTER;
            config.enableToastStacking = false;
            service.init();
            rtmsNotificationQueue.newMsObserver.next(rtmsTestMessage);
            expect(rtmsCommonService.processMessage).not.toHaveBeenCalled();
        });
    });

    describe('showToasters', () => {
        it('should show TOASTERS when processed.', () => {
            service.init();
            appInfoConfig.product;
            const notificationWithType = { type: 'TOASTER' } as NotificationMessageWithType;
            rtmsCommonService.messageProcessedEvents.next(notificationWithType);
            expect(rtmsCommonService.toasterList.length).toBe(1);
            expect(overlayFactory.create).toHaveBeenCalled();
        });
    });

    describe('showOverlays', () => {
        it('should show TOASTERS when processed.', () => {
            service.init();
            appInfoConfig.product;
            const notificationWithType = { type: 'OVERLAY' } as NotificationMessageWithType;
            rtmsCommonService.messageProcessedEvents.next(notificationWithType);
            expect(overlayFactory.create).toHaveBeenCalled();
        });
    });
});
