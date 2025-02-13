import { TestBed } from '@angular/core/testing';

import { RtmsMessage, RtmsType } from '@frontend/vanilla/core';
import { RtmsMessageEx, RtmsSubscriberService } from '@frontend/vanilla/shared/rtms';
import { MockContext } from 'moxxi';

import { UtilsServiceMock } from '../../../core/src/utils/test/utils.mock';
import { LoggerMock } from '../../../core/test/languages/logger.mock';
import { UserServiceMock } from '../../../core/test/user/user.mock';
import { RtmsServiceMock } from './stubs/rtms-mocks';

describe('RtmsSubscriberService', () => {
    let service: RtmsSubscriberService;
    let rtmsServiceMock: RtmsServiceMock;
    let loggerMock: LoggerMock;
    let utilsServiceMock: UtilsServiceMock;

    const rtmsTestMessage: RtmsMessage = {
        type: 'OVERLAY',
        eventId: '123',
        payload: `{"brandId":"BWINCOM","baseTempletId":"/id/0205b25f-9485-4684-9476-1513b6aa539b","applicableProducts":["SPORTSBOOK","CASINO","BINGO","BETTING","POKER"],"frontEndId":"bz","offerTypes":["BONUS_OFFER"],"additionalInfo":{"#CASINO_COEEFICIENT#":"CASINO_COEFF_TEMPLET","#STATIC_MULTIPLIER#":"STATIC_MULTIPLIER_BONUS","#CURRENCY#":"EUR","RESULT":"0","#NO_OF_SLABS#":"1","#OFFER_ID#":"140052660","#EXPIRY_TAKE_BACK#":"BONUS","#FORMAT_DATE_OFFER_EXPIRY_DATE#":"19/08/2017 05:59 AM_CET","#STATIC_RESTED#":"STATIC_RESTED_BONUS","RESULTMSG":"Success","#BRAND#":"BWINCOM","#FORMAT_AMOUNT_BONUS_VALUE#":"10_€","#FORMAT_EMPTY_TIMEZONE#":"CET","#SOURCE_REFERENCE_ID#":"4068563","#APPLICABLE_MOBILE_GAMES#":"{The Sting=winluckofthejackpotmobile, bwin.es Fire Drake II Quest for Honour=winfiredrake2es, Dragons Hoard HTML=netentstarbursttouch, Luck O The Jackpots=yggvikingsgoberzerk, Going Nuts=wmsrainbowrichesfreespins, Going Nuts=minieuropeanroulettepro, Going Nuts=winaztecgoldmobile, Going Nuts=yggsuperheroes, Going Nuts=netentdeadoralivetouch, bwin.es Atlantis Mystery Uncovered=winatlantismysteryes, bwin.es Jade Princess=winjadeprincesses, bwin.es Lucky Paradise=winluckyparadisees}","#FORMAT_AMOUNT_MAXIMUM_BONUS_VALUE#":"10_€","#BONUS_CODE#":"TESTCASOPTIN","#RESTRICTION_FULLFILL_DAYS#":"30","#BONUS_VALUE#":"10","#REST_ACTIVITY_VALUE#":"100","#MINIMUM_DEPOSIT#":"0","#FORMAT_EMPTY_CURRENCY#":"EUR","#PRODUCT#":"Casino","#APPLICABLE_NON_MOBILE_GAMES#":"{ALL=ALL=ALL}","#BONUS_ID#":"4074791","#STATIC_RECOVERY#":"STATIC_RECOVERY_BONUS","#PAY_MODES#":"ALL","#FORMAT_AMOUNT_MINIMUM_DEPOSIT#":"0_€","#BONUS_TYPE#":"6","#GAME_ACTIVITY_TYPE#":"WG","#FORMAT_AMOUNT_REST_ACTIVITY_VALUE#":"100_€","#CLAIM_PERIOD#":"30","#MAXIMUM_BONUS_VALUE#":"10","#IS_TNC_APPLICABLE_FOR_FE#":"YES","#FORMAT_CURRENCY_CURRENCY#":"EUR","#TNC_TEMPLATE#":"POST_TNC_CASINO_CR_FB_OPTIN_WG","#OFFER_EXPIRY_DATE#":"19/08/2017 05:59 AM CET","#BONUS_VALUE_TYPE#":"FIXED"},"campaignId":"27700","notificationType":"OVERLAY","accountName":"bzinboxcta3"}`,
    };

    beforeEach(() => {
        rtmsServiceMock = MockContext.useMock(RtmsServiceMock);
        MockContext.useMock(UserServiceMock);
        loggerMock = MockContext.useMock(LoggerMock);

        utilsServiceMock = MockContext.useMock(UtilsServiceMock);
        utilsServiceMock.generateGuid.and.returnValue('123');

        TestBed.configureTestingModule({
            providers: [MockContext.providers, RtmsSubscriberService],
        });
        service = TestBed.inject(RtmsSubscriberService);
    });

    it('init correctly and log', () => {
        service.init();
        rtmsServiceMock.messages.next(<any>{ type: RtmsType.TOASTER });
        expect(loggerMock.error).toHaveBeenCalledWith('RTMS message not valid: {"type":"TOASTER"}');
    });

    it('init correctly', () => {
        service.init();
        service.messages.subscribe((resultMessage: RtmsMessageEx) => {
            expect(resultMessage).toBeDefined();
            expect(resultMessage.payload).toBeDefined();
            expect(resultMessage.payload.baseTempletId).toBeDefined();
            expect(resultMessage.payload.additionalInfo).toBeDefined();
            expect(resultMessage.payload.offerTypes).toBeDefined();
            expect(resultMessage.destinationUserName).toBeDefined();
            expect(resultMessage.messageId).toBeDefined();
        });
        rtmsServiceMock.messages.next(rtmsTestMessage);
    });
});
