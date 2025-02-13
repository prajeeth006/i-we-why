import { TestBed } from '@angular/core/testing';

import { RtmsLayerNotificationQueue, RtmsMessageEx } from '@frontend/vanilla/shared/rtms';
import { MockContext } from 'moxxi';
import { Subject, of } from 'rxjs';

import { TimerServiceMock } from '../../../../core/src/browser/timer.mock';
import { RtmsLayerMessagesStorageServiceMock, RtmsSubscriberServiceMock } from '../stubs/rtms-mocks';

describe('RtmsMessageQueue', () => {
    let service: RtmsLayerNotificationQueue;

    let rtmsLayerMessagesPubSubServiceMock: RtmsSubscriberServiceMock;
    let rtmsLayerMessagesStorageServiceMock: RtmsLayerMessagesStorageServiceMock;

    const rtmsTestMessage: RtmsMessageEx = <RtmsMessageEx>{
        type: 'OVERLAY',
        payload: JSON.parse(
            `{"brandId":"BWINCOM","baseTempletId":"/id/0205b25f-9485-4684-9476-1513b6aa539b","applicableProducts":["SPORTSBOOK","CASINO","BINGO","BETTING","POKER"],"frontEndId":"bz","offerTypes":["BONUS_OFFER"],"additionalInfo":{"#CASINO_COEEFICIENT#":"CASINO_COEFF_TEMPLET","#STATIC_MULTIPLIER#":"STATIC_MULTIPLIER_BONUS","#CURRENCY#":"EUR","RESULT":"0","#NO_OF_SLABS#":"1","#OFFER_ID#":"140052660","#EXPIRY_TAKE_BACK#":"BONUS","#FORMAT_DATE_OFFER_EXPIRY_DATE#":"19/08/2017 05:59 AM_CET","#STATIC_RESTED#":"STATIC_RESTED_BONUS","RESULTMSG":"Success","#BRAND#":"BWINCOM","#FORMAT_AMOUNT_BONUS_VALUE#":"10_€","#FORMAT_EMPTY_TIMEZONE#":"CET","#SOURCE_REFERENCE_ID#":"4068563","#APPLICABLE_MOBILE_GAMES#":"{The Sting=winluckofthejackpotmobile, bwin.es Fire Drake II Quest for Honour=winfiredrake2es, Dragons Hoard HTML=netentstarbursttouch, Luck O The Jackpots=yggvikingsgoberzerk, Going Nuts=wmsrainbowrichesfreespins, Going Nuts=minieuropeanroulettepro, Going Nuts=winaztecgoldmobile, Going Nuts=yggsuperheroes, Going Nuts=netentdeadoralivetouch, bwin.es Atlantis Mystery Uncovered=winatlantismysteryes, bwin.es Jade Princess=winjadeprincesses, bwin.es Lucky Paradise=winluckyparadisees}","#FORMAT_AMOUNT_MAXIMUM_BONUS_VALUE#":"10_€","#BONUS_CODE#":"TESTCASOPTIN","#RESTRICTION_FULLFILL_DAYS#":"30","#BONUS_VALUE#":"10","#REST_ACTIVITY_VALUE#":"100","#MINIMUM_DEPOSIT#":"0","#FORMAT_EMPTY_CURRENCY#":"EUR","#PRODUCT#":"Casino","#APPLICABLE_NON_MOBILE_GAMES#":"{ALL=ALL=ALL}","#BONUS_ID#":"4074791","#STATIC_RECOVERY#":"STATIC_RECOVERY_BONUS","#PAY_MODES#":"ALL","#FORMAT_AMOUNT_MINIMUM_DEPOSIT#":"0_€","#BONUS_TYPE#":"6","#GAME_ACTIVITY_TYPE#":"WG","#FORMAT_AMOUNT_REST_ACTIVITY_VALUE#":"100_€","#CLAIM_PERIOD#":"30","#MAXIMUM_BONUS_VALUE#":"10","#IS_TNC_APPLICABLE_FOR_FE#":"YES","#FORMAT_CURRENCY_CURRENCY#":"EUR","#TNC_TEMPLATE#":"POST_TNC_CASINO_CR_FB_OPTIN_WG","#OFFER_EXPIRY_DATE#":"19/08/2017 05:59 AM CET","#BONUS_VALUE_TYPE#":"FIXED"},"campaignId":"27700","notificationType":"OVERLAY","accountName":"bzinboxcta3"}`,
        ),
    };

    beforeEach(() => {
        rtmsLayerMessagesPubSubServiceMock = MockContext.useMock(RtmsSubscriberServiceMock);
        rtmsLayerMessagesStorageServiceMock = MockContext.useMock(RtmsLayerMessagesStorageServiceMock);
        MockContext.useMock(TimerServiceMock);

        const rtmskey = 'rtmsMessages';
        const testStorageMessages: { [key: string]: any } = {};
        rtmsLayerMessagesStorageServiceMock.getAll.and.callFake(() => of(testStorageMessages[rtmskey] || []));
        rtmsLayerMessagesStorageServiceMock.set.and.callFake((_key: string, value: any) => (testStorageMessages[rtmskey] = value));
        rtmsLayerMessagesStorageServiceMock.delete.and.callFake(() => delete testStorageMessages[rtmskey]);
        rtmsLayerMessagesStorageServiceMock._hasSameRtmsMessage.and.callFake(() => false);
        TestBed.configureTestingModule({
            providers: [MockContext.providers, RtmsLayerNotificationQueue],
        });
        service = TestBed.inject(RtmsLayerNotificationQueue);
        service['_rtmsMessagesSubject'] = new Subject<RtmsMessageEx | null>();
        service['_rtmsMessagesSubject'].next = jasmine.createSpy('next');
    });

    it('init correctly', () => {
        expect(service.messageList).toBeDefined();
    });

    it('dequeue work correctly', () => {
        const _rtmsTestMessage = Object.assign({}, rtmsTestMessage);
        rtmsLayerMessagesPubSubServiceMock.messages.next(_rtmsTestMessage);
        expect(service.dequeue(false)).toBeDefined();
        expect(rtmsLayerMessagesStorageServiceMock.delete).not.toHaveBeenCalled();
        expect(service.dequeue(false)).toBeDefined();
        expect(service.dequeue()).toBeDefined();
        expect(rtmsLayerMessagesStorageServiceMock.delete).toHaveBeenCalled();
        expect(!!service.dequeue(false)).toBeFalse();
    });

    it('enqueue work correctly', () => {
        const _rtmsTestMessage = Object.assign({}, rtmsTestMessage);
        rtmsLayerMessagesPubSubServiceMock.messages.next(_rtmsTestMessage);
        expect(service.hasMessages()).toBeTrue();
        expect(rtmsLayerMessagesStorageServiceMock.set).toHaveBeenCalled();
        expect(service['_rtmsMessagesSubject'].next).toHaveBeenCalled();
    });
});
