import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RtmsType, ViewTemplateForClient } from '@frontend/vanilla/core';
import { NotificationMessage, NotificationMessageContent, RtmsMessageEx, RtmsMessageType } from '@frontend/vanilla/shared/rtms';
import { MockContext } from 'moxxi';

import { AppInfoConfigMock } from '../../../../core/src/client-config/test/app-info-config.mock';
import { RtmsCommonServiceMock } from '../../../../core/src/rtms/test/rtms.mocks';
import { TrackingServiceMock } from '../../../../core/src/tracking/test/tracking.mock';
import { OverlayRefMock } from '../../../../shared/overlay-factory/test/cdk-overlay.mock';
import { RtmsOverlayContainerComponent } from '../../src/components/overlays/rtms-overlay-container.component';

describe('RtmsOverlayContainerComponent', () => {
    let fixtureComponent: ComponentFixture<RtmsOverlayContainerComponent>;
    let component: RtmsOverlayContainerComponent;
    let appInfoConfig: AppInfoConfigMock;
    let trackingServiceMock: TrackingServiceMock;
    let rtmsCommonServiceMock: RtmsCommonServiceMock;
    let overlayRefMock: OverlayRefMock;

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
    const rtmsTestCurrentNotificationMessage: NotificationMessage = <any>{
        sitecoreId: '/id/0205b25f-9485-4684-9476-1513b6aa539b',
        messageType: RtmsMessageType.EDS_OFFER,
        sourceStatus: RtmsMessageType.BONUS_OFFER,
        content: new NotificationMessageContent(),
        bonusSourceStatus: RtmsMessageType.BONUS_OFFER,
        campaignId: '27700',
    };

    beforeEach(() => {
        appInfoConfig = MockContext.useMock(AppInfoConfigMock);
        trackingServiceMock = MockContext.useMock(TrackingServiceMock);
        rtmsCommonServiceMock = MockContext.useMock(RtmsCommonServiceMock);
        overlayRefMock = MockContext.useMock(OverlayRefMock);
        rtmsCommonServiceMock.rtmsMessage = rtmsTestMessage;
        rtmsCommonServiceMock.currentNotificationMessage = rtmsTestCurrentNotificationMessage;
        TestBed.configureTestingModule({
            schemas: [NO_ERRORS_SCHEMA],
            providers: [MockContext.providers],
        });

        fixtureComponent = TestBed.createComponent(RtmsOverlayContainerComponent);
        component = fixtureComponent.componentInstance;
    });

    it('should set properties onInit', () => {
        rtmsCommonServiceMock.rtmsCommonContent = { text: 'test' } as ViewTemplateForClient;
        component.ngOnInit();
        expect(component.currentMessage).toBe(rtmsCommonServiceMock.rtmsMessage);
        expect(component.messageContent).toBe(rtmsCommonServiceMock.currentNotificationMessage);
        expect(component.sitecoreContent).toBe(rtmsCommonServiceMock.rtmsCommonContent);
        expect(trackingServiceMock.triggerEvent).toHaveBeenCalled();
    });

    it('toggleTaC should hide/expand Terms and conditions', () => {
        component.ngOnInit();
        expect(component.tacActive).toBeFalse();
        expect(trackingServiceMock.triggerEvent).toHaveBeenCalled();
        component.toggleTaC(true);
        expect(component.tacActive).toBeTrue();
        expect(trackingServiceMock.triggerEvent).toHaveBeenCalled();
        appInfoConfig.product;
    });

    it('close should close overlay', () => {
        component.ngOnInit();
        component.close();
        expect(overlayRefMock.detach).toHaveBeenCalled();
        expect(trackingServiceMock.triggerEvent).toHaveBeenCalled();
        expect(rtmsCommonServiceMock.nextMessage).toHaveBeenCalled();
    });
});
