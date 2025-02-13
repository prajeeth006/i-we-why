import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { RtmsType, SwipeDirection } from '@frontend/vanilla/core';
import { NotificationMessage, RtmsMessageEx } from '@frontend/vanilla/shared/rtms';
import { MockContext } from 'moxxi';

import { RtmsCommonServiceMock } from '../../../../core/src/rtms/test/rtms.mocks';
import { TrackingServiceMock } from '../../../../core/src/tracking/test/tracking.mock';
import { UtilsServiceMock } from '../../../../core/src/utils/test/utils.mock';
import { WebWorkerServiceMock } from '../../../../core/test/web-worker/web-worker.service.mock';
import { RtmsClientConfigMock, RtmsLayerNotificationQueueMock } from '../../../../shared/rtms/test/stubs/rtms-mocks';
import { RtmsLayerComponent } from '../../src/components/rtms-layer.component';

describe('RtmsLayerComponent', () => {
    let fixtureComponent: ComponentFixture<RtmsLayerComponent>;
    let component: RtmsLayerComponent;
    let webWorkerServiceMock: WebWorkerServiceMock;
    let trackingServiceMock: TrackingServiceMock;
    let rtmsCommonServiceMock: RtmsCommonServiceMock;
    let utilsServiceMock: UtilsServiceMock;
    let rtmsClientConfigMock: RtmsClientConfigMock;

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
            additionalInfo: {
                '#CASINO_COEEFICIENT#': 'CASINO_COEFF_TEMPLET',
                '#STATIC_MULTIPLIER#': 'STATIC_MULTIPLIER_BONUS',
                '#CURRENCY#': 'EUR',
                'RESULT': '0',
                '#NO_OF_SLABS#': '1',
                '#OFFER_ID#': '140052660',
                '#EXPIRY_TAKE_BACK#': 'BONUS',
                '#FORMAT_DATE_OFFER_EXPIRY_DATE#': '19/08/2017 05:59 AM_CET',
                '#STATIC_RESTED#': 'STATIC_RESTED_BONUS',
                'RESULTMSG': 'Success',
                '#BRAND#': 'BWINCOM',
                '#FORMAT_AMOUNT_BONUS_VALUE#': '10_€',
                '#FORMAT_EMPTY_TIMEZONE#': 'CET',
                '#SOURCE_REFERENCE_ID#': '4068563',
                '#APPLICABLE_MOBILE_GAMES#':
                    '{The Sting=winluckofthejackpotmobile, bwin.es Fire Drake II Quest for Honour=winfiredrake2es, Dragons Hoard HTML=netentstarbursttouch, Luck O The Jackpots=yggvikingsgoberzerk, Going Nuts=wmsrainbowrichesfreespins, Going Nuts=minieuropeanroulettepro, Going Nuts=winaztecgoldmobile, Going Nuts=yggsuperheroes, Going Nuts=netentdeadoralivetouch, bwin.es Atlantis Mystery Uncovered=winatlantismysteryes, bwin.es Jade Princess=winjadeprincesses, bwin.es Lucky Paradise=winluckyparadisees}',
                '#FORMAT_AMOUNT_MAXIMUM_BONUS_VALUE#': '10_€',
                '#BONUS_CODE#': 'TESTCASOPTIN',
                '#RESTRICTION_FULLFILL_DAYS#': '30',
                '#BONUS_VALUE#': '10',
                '#REST_ACTIVITY_VALUE#': '100',
                '#MINIMUM_DEPOSIT#': '0',
                '#FORMAT_EMPTY_CURRENCY#': 'EUR',
                '#PRODUCT#': 'Casino',
                '#APPLICABLE_NON_MOBILE_GAMES#': '{ALL=ALL=ALL}',
                '#BONUS_ID#': '4074791',
                '#STATIC_RECOVERY#': 'STATIC_RECOVERY_BONUS',
                '#PAY_MODES#': 'ALL',
                '#FORMAT_AMOUNT_MINIMUM_DEPOSIT#': '0_€',
                '#BONUS_TYPE#': '6',
                '#GAME_ACTIVITY_TYPE#': 'WG',
                '#FORMAT_AMOUNT_REST_ACTIVITY_VALUE#': '100_€',
                '#CLAIM_PERIOD#': '30',
                '#MAXIMUM_BONUS_VALUE#': '10',
                '#IS_TNC_APPLICABLE_FOR_FE#': 'YES',
                '#FORMAT_CURRENCY_CURRENCY#': 'EUR',
                '#TNC_TEMPLATE#': 'POST_TNC_CASINO_CR_FB_OPTIN_WG',
                '#OFFER_EXPIRY_DATE#': '19/08/2017 05:59 AM CET',
                '#BONUS_VALUE_TYPE#': 'FIXED',
                '#BONUS_SOURCE_STATUS#': 'OFFER_NEW',
            },
        },
    };

    beforeEach(() => {
        webWorkerServiceMock = MockContext.useMock(WebWorkerServiceMock);
        trackingServiceMock = MockContext.useMock(TrackingServiceMock);
        rtmsCommonServiceMock = MockContext.useMock(RtmsCommonServiceMock);
        utilsServiceMock = MockContext.useMock(UtilsServiceMock);
        rtmsClientConfigMock = MockContext.useMock(RtmsClientConfigMock);
        MockContext.useMock(RtmsLayerNotificationQueueMock);

        TestBed.configureTestingModule({
            schemas: [NO_ERRORS_SCHEMA],
            providers: [MockContext.providers],
        });

        utilsServiceMock.generateGuid.and.returnValue('1');
    });

    function initComponent() {
        fixtureComponent = TestBed.createComponent(RtmsLayerComponent);
        component = fixtureComponent.componentInstance;
        rtmsCommonServiceMock.rtmsMessage = rtmsTestMessage;
    }

    it(`showMessage should work correctly: ${RtmsType.TOASTER}`, fakeAsync(() => itShowMessage(<RtmsType>RtmsType.TOASTER)));
    it(`showMessage should work correctly: ${RtmsType.OVERLAY}`, fakeAsync(() => itShowMessage(<RtmsType>RtmsType.OVERLAY)));

    it('leaveMessageVisible should work correctly', () => {
        initComponent();

        component.leaveMessageVisible();

        expect(webWorkerServiceMock.removeWorker).toHaveBeenCalledOnceWith(rtmsCommonServiceMock.webWorkerId);
        expect(trackingServiceMock.triggerEvent).toHaveBeenCalled();
    });

    it('closeByTimeout should work correctly', () => {
        initComponent();
        spyOn(component, 'close');

        component.closeByTimeout();

        expect(component.close).toHaveBeenCalled();
        expect(trackingServiceMock.triggerEvent).toHaveBeenCalled();
    });

    it('closeManually should work correctly', () => {
        initComponent();
        spyOn(component, 'close');

        component.closeManually();

        expect(component.close).toHaveBeenCalled();
    });

    it('swipe left should work correctly', () => {
        initComponent();
        spyOn(component, 'closeManually');

        component.onSwipe(SwipeDirection.Left);

        expect(component.closeManually).toHaveBeenCalled();
    });

    it('swipe right should work correctly', () => {
        initComponent();
        spyOn(component, 'closeManually');

        component.onSwipe(SwipeDirection.Right);

        expect(component.closeManually).toHaveBeenCalled();
    });

    function itShowMessage(rtmsType: RtmsType) {
        const testNotificationMsg: NotificationMessage = <NotificationMessage>{ id: '1', campaignId: '123' };

        initComponent();
        spyOn(component, 'closeByTimeout');
        component.messageContent = <any>null;
        rtmsCommonServiceMock.rtmsMessage.type = rtmsType;

        component.showMessage(testNotificationMsg);

        expect(component.messageContent).toBe(testNotificationMsg);
        expect(trackingServiceMock.triggerEvent).toHaveBeenCalled();

        if (rtmsType === RtmsType.TOASTER) {
            expect(utilsServiceMock.generateGuid).toHaveBeenCalled();
            expect(webWorkerServiceMock.createWorker).toHaveBeenCalledOnceWith(
                rtmsCommonServiceMock.webWorkerId,
                { timeout: rtmsClientConfigMock.toastShowTime * 1000 },
                jasmine.any(Function),
            );

            tick(1000);

            expect(component.closeByTimeout).toHaveBeenCalled();
            expect(webWorkerServiceMock.removeWorker).toHaveBeenCalledOnceWith(rtmsCommonServiceMock.webWorkerId);
        }
    }
});
