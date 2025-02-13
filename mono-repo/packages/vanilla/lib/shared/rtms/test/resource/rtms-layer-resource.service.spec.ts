import { TestBed } from '@angular/core/testing';

import { RtmsLayerMessageRequest, RtmsLayerResourceService } from '@frontend/vanilla/shared/rtms';
import { MockContext } from 'moxxi';

import { SharedFeaturesApiServiceMock } from '../../../../core/src/http/test/shared-features-api.mock';

describe('RtmsLayerResourceService', () => {
    let service: RtmsLayerResourceService;
    let apiService: SharedFeaturesApiServiceMock;

    beforeEach(() => {
        apiService = MockContext.useMock(SharedFeaturesApiServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, RtmsLayerResourceService],
        });
    });
    beforeEach(() => {
        service = TestBed.inject(RtmsLayerResourceService);
    });

    it('variables and methods should be initialized correctly', () => {
        expect(service.getMessagesContent).toBeDefined();
        expect(service.getMessagesInitData).toBeDefined();
    });

    it('should call api rtms/getMessages on getMessages', () => {
        const testMessageRequests: Array<RtmsLayerMessageRequest> = getTestQueries();
        service.getMessagesContent(testMessageRequests);
        expect(apiService.post).toHaveBeenCalledWith('rtms/messages', testMessageRequests, { showSpinner: false });
    });

    it('should call api rtms/getmessagesinitdata', () => {
        service.getMessagesInitData();
        expect(apiService.get).toHaveBeenCalledWith('rtms/messagesinitdata');
    });

    function getTestQueries(): Array<RtmsLayerMessageRequest> {
        return [
            {
                messageId: '8309cb90-04c6-4603-b284-8a1260214118',
                templateId: '/id/97b54034-fa8a-4d8b-a41d-88ea7e8b5c63',
                messageType: 'BONUS_OFFER',
                campaignId: '21933',
                templateMetaData: {
                    '#BONUS_VALUE_TYPE#': 'FIXED',
                    '#WAGER_FACTOR#': '5',
                    '#APPLICABLE_MOBILE_CHANNELS#': '[MOBILEWEB, MOBILEAPP]',
                    '#GAME_ACTIVITY_TYPE#': 'WG',
                    '#STATIC_MULTIPLIER#': 'STATIC_MULTIPLIER_BONUS',
                    '#CURRENCY#': 'EUR',
                    '#FORMAT_EMPTY_TIMEZONE#': 'CET',
                    'RESULT': '0',
                    '#OFFER_ID#': '4982854',
                    '#PAY_MODES#': 'ALL',
                    'RESULTMSG': 'Success',
                    '#BONUS_TYPE#': '6',
                    '#PRODUCT#': 'Casino',
                    '#CLAIM_PERIOD#': '30',
                    '#FORMAT_AMOUNT_BONUS_VALUE#': '0_€',
                    '#RESTRICTION_FULLFILL_DAYS#': '90',
                    '#MISC_TEMPLATE#': 'CASINO_COEFF_TEMPLET',
                    '#EXPIRY_TAKE_BACK#': 'BONUS',
                    '#NO_OF_SPINS#': '5',
                    '#BONUS_CODE#': 'AZTECFSPIN',
                    '#APPLICABLE_GAMES#': '{Slots={Aztec Gold HTML=winaztecgold, Aztec Gold Mobile=winaztecgoldmobile}}',
                    '#MAXIMUM_BONUS_VALUE#': '0',
                    '#STATIC_RESTED#': 'STATIC_RESTED_BONUS',
                    '#STATIC_RECOVERY#': 'STATIC_RECOVERY_BONUS',
                    '#APPLICABLE_NONMOBILE_CHANNELS#': '[MOBILEWEB, MOBILEAPP]',
                    '#FORMAT_AMOUNT_MINIMUM_DEPOSIT#': '0_€',
                    '#TNC_TEMPLATE#': 'POST_TNC_CASINO_CR_FREESPIN_OPTIN',
                    '#APPLICABLE_NON_MOBILE_GAMES#': '{Aztec Gold HTML=winaztecgold}',
                    '#FORMAT_EMPTY_CURRENCY#': 'EUR',
                    '#FORMAT_AMOUNT_MAXIMUM_BONUS_VALUE#': '0_€',
                    '#NO_OF_SLABS#': '1',
                    '#BONUS_VALUE#': '0',
                    '#REST_ACTIVITY_VALUE#': '0',
                    '#MINIMUM_DEPOSIT#': '0',
                    '#IS_FREE_SPIN_BONUS#': 'Y',
                    '#BRAND#': 'BWINCOM',
                    '#BONUS_ID#': '4982854',
                    '#SOURCE_REFERENCE_ID#': '4982854',
                    '#APPLICABLE_MOBILE_GAMES#': '{Aztec Gold Mobile=winaztecgoldmobile}',
                    '#FORMAT_DATE_OFFER_EXPIRY_DATE#': '18/12/2017 05:59 AM_CET',
                    '#FORMAT_AMOUNT_REST_ACTIVITY_VALUE#': '0_€',
                    '#OFFER_EXPIRY_DATE#': '18/12/2017 05:59 AM CET',
                    '#IS_TNC_APPLICABLE_FOR_FE#': 'YES',
                    '#FORMAT_CURRENCY_CURRENCY#': 'EUR',
                    '#APPLICABLE_CHANNELS#': 'ALL',
                },
            },
            {
                messageId: '8762c1ae-c3d6-4a79-9418-9788faec86d5',
                templateId: '/id/97b54034-fa8a-4d8b-a41d-88ea7e8b5c63',
                messageType: 'BONUS_OFFER',
                campaignId: '21933',
                templateMetaData: {
                    '#FORMAT_EMPTY_TIMEZONE#': 'CET',
                    '#APPLICABLE_NONMOBILE_CHANNELS#': '[MOBILEWEB, MOBILEAPP]',
                    '#RESTRICTION_FULLFILL_DAYS#': '90',
                    '#REST_ACTIVITY_VALUE#': '0',
                    '#IS_FREE_SPIN_BONUS#': 'Y',
                    '#PAY_MODES#': 'ALL',
                    '#NO_OF_SLABS#': '1',
                    '#CURRENCY#': 'EUR',
                    '#FORMAT_EMPTY_CURRENCY#': 'EUR',
                    '#APPLICABLE_MOBILE_CHANNELS#': '[MOBILEWEB, MOBILEAPP]',
                    '#PRODUCT#': 'Casino',
                    '#BONUS_VALUE_TYPE#': 'FIXED',
                    'RESULTMSG': 'Success',
                    'RESULT': '0',
                    '#APPLICABLE_MOBILE_GAMES#': '{Aztec Gold Mobile=winaztecgoldmobile}',
                    '#FORMAT_AMOUNT_REST_ACTIVITY_VALUE#': '0_€',
                    '#FORMAT_AMOUNT_MAXIMUM_BONUS_VALUE#': '0_€',
                    '#FORMAT_AMOUNT_BONUS_VALUE#': '0_€',
                    '#STATIC_RECOVERY#': 'STATIC_RECOVERY_BONUS',
                    '#EXPIRY_TAKE_BACK#': 'BONUS',
                    '#STATIC_MULTIPLIER#': 'STATIC_MULTIPLIER_BONUS',
                    '#APPLICABLE_CHANNELS#': 'ALL',
                    '#BRAND#': 'BWINCOM',
                    '#APPLICABLE_NON_MOBILE_GAMES#': '{Aztec Gold HTML=winaztecgold}',
                    '#IS_TNC_APPLICABLE_FOR_FE#': 'YES',
                    '#FORMAT_AMOUNT_MINIMUM_DEPOSIT#': '0_€',
                    '#OFFER_ID#': '4982854',
                    '#NO_OF_SPINS#': '5',
                    '#FORMAT_DATE_OFFER_EXPIRY_DATE#': '18/12/2017 05:59 AM_CET',
                    '#BONUS_ID#': '4982854',
                    '#TNC_TEMPLATE#': 'POST_TNC_CASINO_CR_FREESPIN_OPTIN',
                    '#OFFER_EXPIRY_DATE#': '18/12/2017 05:59 AM CET',
                    '#WAGER_FACTOR#': '5',
                    '#GAME_ACTIVITY_TYPE#': 'WG',
                    '#APPLICABLE_GAMES#': '{Slots={Aztec Gold HTML=winaztecgold, Aztec Gold Mobile=winaztecgoldmobile}}',
                    '#SOURCE_REFERENCE_ID#': '4982854',
                    '#BONUS_VALUE#': '0',
                    '#MISC_TEMPLATE#': 'CASINO_COEFF_TEMPLET',
                    '#MINIMUM_DEPOSIT#': '0',
                    '#BONUS_CODE#': 'AZTECFSPIN',
                    '#FORMAT_CURRENCY_CURRENCY#': 'EUR',
                    '#BONUS_TYPE#': '6',
                    '#CLAIM_PERIOD#': '30',
                    '#MAXIMUM_BONUS_VALUE#': '0',
                    '#STATIC_RESTED#': 'STATIC_RESTED_BONUS',
                },
            },
            {
                messageId: '25592e1a-fdcf-4746-8206-9e910a0fe2fd',
                templateId: '/id/034640ce-548d-4583-b2df-52d2e41385e4',
                messageType: 'BONUS_OFFER',
                campaignId: '21929',
                templateMetaData: {
                    '#STATIC_RECOVERY#': 'STATIC_RECOVERY_BONUS',
                    '#FORMAT_EMPTY_TIMEZONE#': 'CET',
                    '#MISC_TEMPLATE#': 'CASINO_COEFF_TEMPLET',
                    '#APPLICABLE_NON_MOBILE_GAMES#': '{Slots=Mini Aztec Gold=miniaztecgold}',
                    '#BONUS_ID#': '4982842',
                    '#OFFER_ID#': '93125663',
                    '#FORMAT_DATE_OFFER_EXPIRY_DATE#': '18/12/2017 05:59 AM_CET',
                    '#FORMAT_AMOUNT_REST_ACTIVITY_VALUE#': '5_€',
                    '#BONUS_CODE#': 'ONEGAMEBOUS',
                    '#CURRENCY#': 'EUR',
                    '#FORMAT_AMOUNT_BONUS_VALUE#': '50_€',
                    '#MINIMUM_DEPOSIT#': '0',
                    '#BONUS_TYPE#': '6',
                    '#STATIC_RESTED#': 'STATIC_RESTED_BONUS',
                    '#SOURCE_REFERENCE_ID#': '4982842',
                    '#TNC_TEMPLATE#': 'POST_TNC_CASINO_CR_FB_OPTIN_WG',
                    '#REST_ACTIVITY_VALUE#': '5',
                    '#APPLICABLE_MOBILE_GAMES#': '{Slots=Mini Aztec Gold=miniaztecgold}',
                    '#MAXIMUM_BONUS_VALUE#': '50',
                    '#FORMAT_CURRENCY_CURRENCY#': 'EUR',
                    '#RESTRICTION_FULLFILL_DAYS#': '30',
                    '#BRAND#': 'BWINCOM',
                    '#GAME_ACTIVITY_TYPE#': 'WG',
                    '#PAY_MODES#': 'ALL',
                    'RESULTMSG': 'Success',
                    'RESULT': '0',
                    '#BONUS_VALUE#': '50',
                    '#EXPIRY_TAKE_BACK#': 'BONUS',
                    '#FORMAT_AMOUNT_MAXIMUM_BONUS_VALUE#': '50_€',
                    '#PRODUCT#': 'Casino',
                    '#FORMAT_AMOUNT_MINIMUM_DEPOSIT#': '0_€',
                    '#NO_OF_SLABS#': '1',
                    '#STATIC_MULTIPLIER#': 'STATIC_MULTIPLIER_BONUS',
                    '#BONUS_VALUE_TYPE#': 'FIXED',
                    '#IS_TNC_APPLICABLE_FOR_FE#': 'YES',
                    '#OFFER_EXPIRY_DATE#': '18/12/2017 05:59 AM CET',
                    '#CLAIM_PERIOD#': '30',
                    '#FORMAT_EMPTY_CURRENCY#': 'EUR',
                },
            },
            {
                messageId: '7111b099-ae4d-4941-a579-b150c9be50a7',
                templateId: '/id/034640ce-548d-4583-b2df-52d2e41385e4',
                messageType: 'BONUS_OFFER',
                campaignId: '21929',
                templateMetaData: {
                    '#BONUS_CODE#': 'ONEGAMEBOUS',
                    '#BONUS_ID#': '4982842',
                    '#FORMAT_EMPTY_CURRENCY#': 'EUR',
                    '#REST_ACTIVITY_VALUE#': '5',
                    '#FORMAT_AMOUNT_REST_ACTIVITY_VALUE#': '5_€',
                    '#STATIC_MULTIPLIER#': 'STATIC_MULTIPLIER_BONUS',
                    '#CURRENCY#': 'EUR',
                    '#RESTRICTION_FULLFILL_DAYS#': '30',
                    '#NO_OF_SLABS#': '1',
                    '#EXPIRY_TAKE_BACK#': 'BONUS',
                    '#FORMAT_AMOUNT_BONUS_VALUE#': '50_€',
                    '#PAY_MODES#': 'ALL',
                    '#FORMAT_CURRENCY_CURRENCY#': 'EUR',
                    '#BONUS_VALUE#': '50',
                    '#GAME_ACTIVITY_TYPE#': 'WG',
                    '#BONUS_VALUE_TYPE#': 'FIXED',
                    '#STATIC_RECOVERY#': 'STATIC_RECOVERY_BONUS',
                    '#FORMAT_DATE_OFFER_EXPIRY_DATE#': '18/12/2017 05:59 AM_CET',
                    '#BRAND#': 'BWINCOM',
                    '#FORMAT_AMOUNT_MAXIMUM_BONUS_VALUE#': '50_€',
                    '#STATIC_RESTED#': 'STATIC_RESTED_BONUS',
                    '#FORMAT_EMPTY_TIMEZONE#': 'CET',
                    '#TNC_TEMPLATE#': 'POST_TNC_CASINO_CR_FB_OPTIN_WG',
                    '#MISC_TEMPLATE#': 'CASINO_COEFF_TEMPLET',
                    '#OFFER_ID#': '93125663',
                    '#OFFER_EXPIRY_DATE#': '18/12/2017 05:59 AM CET',
                    '#CLAIM_PERIOD#': '30',
                    '#MAXIMUM_BONUS_VALUE#': '50',
                    'RESULT': '0',
                    '#MINIMUM_DEPOSIT#': '0',
                    '#PRODUCT#': 'Casino',
                    'RESULTMSG': 'Success',
                    '#SOURCE_REFERENCE_ID#': '4982842',
                    '#FORMAT_AMOUNT_MINIMUM_DEPOSIT#': '0_€',
                    '#APPLICABLE_MOBILE_GAMES#': '{Slots=Mini Aztec Gold=miniaztecgold}',
                    '#BONUS_TYPE#': '6',
                    '#APPLICABLE_NON_MOBILE_GAMES#': '{Slots=Mini Aztec Gold=miniaztecgold}',
                    '#IS_TNC_APPLICABLE_FOR_FE#': 'YES',
                },
            },
        ];
    }
});
