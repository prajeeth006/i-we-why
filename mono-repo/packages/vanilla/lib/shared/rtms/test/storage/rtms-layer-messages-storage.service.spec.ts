import { TestBed } from '@angular/core/testing';

import { STORE_PREFIX } from '@frontend/vanilla/core';
import { RtmsLayerMessagesStorageService, RtmsMessageEx, RtmsMessagePayload } from '@frontend/vanilla/shared/rtms';
import { MockContext } from 'moxxi';
import { of } from 'rxjs';

import { NativeAppServiceMock } from '../../../../core/test/native-app/native-app.mock';
import { UserServiceMock } from '../../../../core/test/user/user.mock';
import { RtmsLayerStorageBaseMock } from '../stubs/rtms-mocks';

describe('RtmsMessageStorage', () => {
    let service: RtmsLayerMessagesStorageService;
    let userServiceMock: UserServiceMock;
    let rtmsLayerStorageBaseMock: RtmsLayerStorageBaseMock;
    let nativeAppServiceMock: NativeAppServiceMock;

    const rtmsTestMessage: RtmsMessageEx = <RtmsMessageEx>{
        type: 'OVERLAY',
        payload: JSON.parse(
            `{"brandId":"BWINCOM","baseTemplateId":"/id/0205b25f-9485-4684-9476-1513b6aa539b","applicableProducts":["SPORTSBOOK","CASINO","BINGO","BETTING","POKER"],"frontEndId":"bz","offerTypes":["BONUS_OFFER"],"additionalInfo":{"#CASINO_COEEFICIENT#":"CASINO_COEFF_TEMPLET","#STATIC_MULTIPLIER#":"STATIC_MULTIPLIER_BONUS","#CURRENCY#":"EUR","RESULT":"0","#NO_OF_SLABS#":"1","#OFFER_ID#":"140052660","#EXPIRY_TAKE_BACK#":"BONUS","#FORMAT_DATE_OFFER_EXPIRY_DATE#":"19/08/2017 05:59 AM_CET","#STATIC_RESTED#":"STATIC_RESTED_BONUS","RESULTMSG":"Success","#BRAND#":"BWINCOM","#FORMAT_AMOUNT_BONUS_VALUE#":"10_€","#FORMAT_EMPTY_TIMEZONE#":"CET","#SOURCE_REFERENCE_ID#":"4068563","#APPLICABLE_MOBILE_GAMES#":"{The Sting=winluckofthejackpotmobile, bwin.es Fire Drake II Quest for Honour=winfiredrake2es, Dragons Hoard HTML=netentstarbursttouch, Luck O The Jackpots=yggvikingsgoberzerk, Going Nuts=wmsrainbowrichesfreespins, Going Nuts=minieuropeanroulettepro, Going Nuts=winaztecgoldmobile, Going Nuts=yggsuperheroes, Going Nuts=netentdeadoralivetouch, bwin.es Atlantis Mystery Uncovered=winatlantismysteryes, bwin.es Jade Princess=winjadeprincesses, bwin.es Lucky Paradise=winluckyparadisees}","#FORMAT_AMOUNT_MAXIMUM_BONUS_VALUE#":"10_€","#BONUS_CODE#":"TESTCASOPTIN","#RESTRICTION_FULLFILL_DAYS#":"30","#BONUS_VALUE#":"10","#REST_ACTIVITY_VALUE#":"100","#MINIMUM_DEPOSIT#":"0","#FORMAT_EMPTY_CURRENCY#":"EUR","#PRODUCT#":"Casino","#APPLICABLE_NON_MOBILE_GAMES#":"{ALL=ALL=ALL}","#BONUS_ID#":"4074791","#STATIC_RECOVERY#":"STATIC_RECOVERY_BONUS","#PAY_MODES#":"ALL","#FORMAT_AMOUNT_MINIMUM_DEPOSIT#":"0_€","#BONUS_TYPE#":"6","#GAME_ACTIVITY_TYPE#":"WG","#FORMAT_AMOUNT_REST_ACTIVITY_VALUE#":"100_€","#CLAIM_PERIOD#":"30","#MAXIMUM_BONUS_VALUE#":"10","#IS_TNC_APPLICABLE_FOR_FE#":"YES","#FORMAT_CURRENCY_CURRENCY#":"EUR","#TNC_TEMPLATE#":"POST_TNC_CASINO_CR_FB_OPTIN_WG","#OFFER_EXPIRY_DATE#":"19/08/2017 05:59 AM CET","#BONUS_VALUE_TYPE#":"FIXED"},"campaignId":"27700","notificationType":"OVERLAY","accountName":"bzinboxcta3"}`,
        ),
    };

    beforeEach(() => {
        userServiceMock = MockContext.useMock(UserServiceMock);
        rtmsLayerStorageBaseMock = MockContext.useMock(RtmsLayerStorageBaseMock);
        nativeAppServiceMock = MockContext.useMock(NativeAppServiceMock);

        const rtmskey = 'rtmsMessages';
        const testStorageMessages: { [key: string]: any } = {};
        rtmsLayerStorageBaseMock.get.and.callFake(() => of(testStorageMessages[rtmskey]));
        rtmsLayerStorageBaseMock.set.and.callFake((_key: string, value: any) => (testStorageMessages[rtmskey] = value));
        rtmsLayerStorageBaseMock.set.and.callFake((_key: string, value: any) => (testStorageMessages[rtmskey] = value));

        TestBed.configureTestingModule({
            providers: [MockContext.providers, RtmsLayerMessagesStorageService, { provide: STORE_PREFIX, useValue: 'van.' }],
        });
    });

    function createService(isNative: boolean = false) {
        nativeAppServiceMock.isNative = isNative;
        service = TestBed.inject(RtmsLayerMessagesStorageService);
    }

    it('rtmsClientConfig disabled', () => {
        createService();
        const ms1: RtmsMessageEx = new RtmsMessageEx();
        const ms2: RtmsMessageEx = new RtmsMessageEx();
        const ms3: RtmsMessageEx = new RtmsMessageEx();
        ms1.payload = new RtmsMessagePayload();
        ms2.payload = new RtmsMessagePayload();
        ms3.payload = new RtmsMessagePayload();

        ms1.type = ms2.type = ms3.type = rtmsTestMessage.type;
        ms1.payload = Object.assign({}, rtmsTestMessage.payload);
        ms2.payload = Object.assign({}, rtmsTestMessage.payload);
        ms3.payload = Object.assign({}, rtmsTestMessage.payload);

        ms1.payload.baseTempletId += '111';
        ms2.payload.baseTempletId += '222';
        ms3.payload.baseTempletId += '333';

        ms1.messageId = '1';
        ms2.messageId = '2';
        ms3.messageId = '3';
        ms1.destinationUserName = ms2.destinationUserName = 'TestUserName';
        ms3.destinationUserName = 'otheruser';

        service.set(ms1);
        service.set(ms2);
        service.set(ms3);

        userServiceMock.username = ms1.destinationUserName;
        service.getAll().subscribe((resMessages: RtmsMessageEx[]) => {
            expect(resMessages).toBeDefined();
            expect(resMessages.length).toBe(2);
        });

        userServiceMock.username = ms3.destinationUserName;
        service.getAll().subscribe((resMessages: RtmsMessageEx[]) => {
            expect(resMessages).toBeDefined();
            expect(resMessages.length).toBe(1);
        });

        //------------------------------------------------------
        service.delete(ms1);
        service.delete(ms2);
        service.delete(ms3);

        userServiceMock.username = ms1.destinationUserName;
        service.getAll().subscribe((resMessages: RtmsMessageEx[]) => {
            expect(resMessages).toBeDefined();
            expect(resMessages.length).toBe(0);
        });

        userServiceMock.username = ms3.destinationUserName;
        service.getAll().subscribe((resMessages: RtmsMessageEx[]) => {
            expect(resMessages).toBeDefined();
            expect(resMessages.length).toBe(0);
        });
    });
});
