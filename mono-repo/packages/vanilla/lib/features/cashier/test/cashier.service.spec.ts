import { TestBed } from '@angular/core/testing';

import { WINDOW } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { WindowMock } from '../../../core/src/browser/window/test/window-ref.mock';
import { AppInfoConfigMock } from '../../../core/src/client-config/test/app-info-config.mock';
import { TrackingServiceMock } from '../../../core/src/tracking/test/tracking.mock';
import { PageMock } from '../../../core/test/browsercommon/page.mock';
import { NativeAppConfigMock, NativeAppServiceMock } from '../../../core/test/native-app/native-app.mock';
import { NavigationServiceMock } from '../../../core/test/navigation/navigation.mock';
import { ProductHomepagesConfigMock } from '../../../core/test/products/product-homepages.client-config.mock';
import { UserServiceMock } from '../../../core/test/user/user.mock';
import { CashierService } from '../src/cashier.service';
import { CashierConfigMock, QuickDepositServiceMock } from './cashier.mock';
import { FrontendHelperServiceMock } from './frontend-service.mock';

describe('CashierService', () => {
    let service: CashierService;
    let trackingServiceMock: TrackingServiceMock;
    let appInfoConfigMock: AppInfoConfigMock;
    let userServiceMock: UserServiceMock;
    let windowMock: WindowMock;
    let cashierConfigMock: CashierConfigMock;
    let nativeAppServiceMock: NativeAppServiceMock;
    let nativeAppSettingsConfigMock: NativeAppConfigMock;
    let pageMock: PageMock;
    let quickDepositServiceMock: QuickDepositServiceMock;
    let frontendHelperServiceMock: FrontendHelperServiceMock;

    beforeEach(() => {
        userServiceMock = MockContext.useMock(UserServiceMock);
        trackingServiceMock = MockContext.useMock(TrackingServiceMock);
        appInfoConfigMock = MockContext.useMock(AppInfoConfigMock);
        windowMock = new WindowMock();
        cashierConfigMock = MockContext.useMock(CashierConfigMock);
        nativeAppServiceMock = MockContext.useMock(NativeAppServiceMock);
        nativeAppSettingsConfigMock = MockContext.useMock(NativeAppConfigMock);
        pageMock = MockContext.useMock(PageMock);
        quickDepositServiceMock = MockContext.useMock(QuickDepositServiceMock);
        frontendHelperServiceMock = MockContext.useMock(FrontendHelperServiceMock);
        MockContext.useMock(ProductHomepagesConfigMock);
        MockContext.useMock(NavigationServiceMock);

        TestBed.configureTestingModule({
            providers: [
                MockContext.providers,
                CashierService,
                {
                    provide: WINDOW,
                    useValue: windowMock,
                },
            ],
        });
    });

    beforeEach(() => {
        cashierConfigMock.host = 'https://cashier.unit.test';
        cashierConfigMock.singleSignOnIntegrationType = 'cookie';
        cashierConfigMock.depositUrlTemplate = '/deposit/depositOptionsMerchant.action?LANG_ID={1}&parent={2}&trid={3}';
        cashierConfigMock.withdrawUrlTemplate = '/cashout/cashoutOptionsMerchant.action?LANG_ID={1}&parent={2}';
        cashierConfigMock.transactionHistoryUrlTemplate = '/home/txnSearchPageMerchant.action?LANG_ID={1}&parent={2}';
        cashierConfigMock.paymentPreferencesUrlTemplate = '/cashier/cashier.html?LANG_ID={1}&parent={2}&trid={3}';
        cashierConfigMock.urlTemplate = '/home/menu.action?LANG_ID={1}&parent={2}&trid={3}';
        cashierConfigMock.manageMyCardsUrlTemplate = '/home/cards.action?LANG_ID={1}&parent={2}&trid={3}';
        cashierConfigMock.quickDepositUrlTemplate =
            '/cashierapp/cashier.html?userId={USERID}&brandId={BRANDID}&productId={PRODUCTID}&channelId={CHANNELID}&langId={LANG}&sessionKey={SSO}';
        cashierConfigMock.isQuickDepositEnabled = false;
        appInfoConfigMock.product = 'poker';
        frontendHelperServiceMock.getFrontendDescription.and.returnValue('desktop');

        service = TestBed.inject(CashierService);
    });

    describe('generateCashierUrl()', () => {
        it('should trigger tracking event "pageView" when skipTracking is false', () => {
            service.generateCashierUrl({ skipTracking: false });
            expect(trackingServiceMock.triggerEvent).toHaveBeenCalledWith('pageView', {
                'page.name': 'CashierCTA',
            });
        });

        it('should append returnUrl when skipTracking is false and nativeApp.configuration.enableAppsFlyer is true', () => {
            nativeAppSettingsConfigMock.enableAppsFlyer = true;
            windowMock.location.host = 'acme.com';
            windowMock.location.protocol = 'https';
            userServiceMock.ssoToken = 'sso';
            userServiceMock.id = 'userId';

            const url = service.generateCashierUrl({ trackerId: 'trid1' });
            const expected =
                cashierConfigMock.host +
                cashierConfigMock.urlTemplate
                    .replace('{0}', userServiceMock.ssoToken)
                    .replace('{1}', pageMock.lang)
                    .replace('{2}', 'https%3A%2F%2Facme.com%2Fen%3FbackToAppPath%3Dnativeapp%2FbackToAppEx')
                    .replace('{3}', 'trid1') +
                '&userId=userId&channelId=WC&brandId=PARTY&productId=poker&frontend=desktop';

            expect(url).toBe(expected);
        });

        it('should append clientAppPath=1 when isNativeApp', () => {
            nativeAppServiceMock.isNativeApp = true;
            const url = service.generateCashierUrl({});
            expect(url).toContain('&clientAppPath=1');
        });

        it('should append clientAppPath=2 when isNativeWrapper', () => {
            nativeAppServiceMock.isNativeWrapper = true;
            const url = service.generateCashierUrl({});
            expect(url).toContain('&clientAppPath=2');
        });

        it('should append parameters when set', () => {
            const url = service.generateCashierUrl({
                queryParameters: {
                    ['txnID']: 'xxx',
                    ['preference']: '&PAYPAL',
                },
            });
            const expected = `${cashierConfigMock.host}/home/menu.action?LANG_ID=en&parent=undefined&trid=&txnID=xxx&preference=%26PAYPAL&channelId=WC&brandId=PARTY&productId=poker&frontend=desktop`;

            expect(frontendHelperServiceMock.getFrontendDescription).toHaveBeenCalled();
            expect(url).toBe(expected);
        });
    });

    describe('goToCashierDeposit()', () => {
        it('should call quickdepositservice open', () => {
            service.goToCashierDeposit({});

            quickDepositServiceMock.isEnabled.completeWith(true);
            expect(quickDepositServiceMock.open).toHaveBeenCalled();
        });

        it('should not call open', () => {
            service.goToCashierDeposit({ skipQuickDeposit: true });

            expect(quickDepositServiceMock.open).not.toHaveBeenCalled();
        });

        it('should track custom data for normal deposit', () => {
            service.goToCashierDeposit({
                customTracking: {
                    eventName: 'evt',
                    data: {
                        a: '1',
                        t: '__type__',
                    },
                },
            });

            quickDepositServiceMock.isEnabled.completeWith(false);

            expect(trackingServiceMock.triggerEvent).toHaveBeenCalledWith('evt', { a: '1', t: 'Normal' });
        });

        it('should track custom data for quick deposit', () => {
            service.goToCashierDeposit({
                customTracking: {
                    eventName: 'evt',
                    data: {
                        a: '1',
                        t: '__type__',
                    },
                },
            });

            quickDepositServiceMock.isEnabled.completeWith(true);

            expect(trackingServiceMock.triggerEvent).toHaveBeenCalledWith('evt', { a: '1', t: 'Quick' });
        });

        it('should not track custom data if not specified', () => {
            service.goToCashierDeposit({});

            expect(trackingServiceMock.triggerEvent).not.toHaveBeenCalled();
        });

        it('should not track custom data if skipTracking is specified', () => {
            service.goToCashierDeposit({
                skipTracking: true,
                customTracking: {
                    eventName: 'evt',
                    data: {
                        a: '1',
                    },
                },
            });

            expect(trackingServiceMock.triggerEvent).not.toHaveBeenCalled();
        });
    });

    const goToCashierScenarios: Record<string, any> = {
        'goToCashier() should set href': { fnName: 'goToCashier', pathTemplate: 'urlTemplate' },
        'goToCashier() should replace location in history': {
            fnName: 'goToCashier',
            pathTemplate: 'urlTemplate',
            replaceInHistory: true,
        },
        'goToCashierDeposit() should set href': { fnName: 'goToCashierDeposit', pathTemplate: 'depositUrlTemplate' },
        'goToCashierDeposit() should replace location in history': {
            fnName: 'goToCashierDeposit',
            pathTemplate: 'depositUrlTemplate',
            replaceInHistory: true,
        },
        'goToCashierWithdrawal() should set href': {
            fnName: 'goToCashierWithdrawal',
            pathTemplate: 'withdrawUrlTemplate',
        },
        'goToManageMyCards() should set href': {
            fnName: 'goToManageMyCards',
            pathTemplate: 'manageMyCardsUrlTemplate',
        },
        'goToPaymentPreferences() should set href': {
            fnName: 'goToPaymentPreferences',
            pathTemplate: 'paymentPreferencesUrlTemplate',
        },
        'goToCashierWithdrawal() should replace location in history': {
            fnName: 'goToCashierWithdrawal',
            pathTemplate: 'withdrawUrlTemplate',
            replaceInHistory: true,
        },
    };

    Object.keys(goToCashierScenarios).forEach((key: string) => {
        it(key, () => {
            // arrange
            const scenario = goToCashierScenarios[key];
            userServiceMock.ssoToken = 'sso-token';
            userServiceMock.id = 'userId';
            const options = {
                returnUrl: 'https://return-url',
                trackerId: 'trid1',
                replaceInHistory: scenario.replaceInHistory,
            };

            // act
            (service as any)[scenario.fnName](options); //e.g. service.goToCashier(options);

            if (scenario.fnName === 'goToCashierDeposit') {
                quickDepositServiceMock.isEnabled.completeWith(false);
            }
            // assert
            const expected =
                cashierConfigMock.host +
                cashierConfigMock[scenario.pathTemplate]
                    .replace('{0}', userServiceMock.ssoToken)
                    .replace('{1}', pageMock.lang)
                    .replace('{2}', encodeURIComponent(options.returnUrl))
                    .replace('{3}', options.trackerId) +
                '&userId=userId&channelId=WC&brandId=PARTY&productId=poker&frontend=desktop';

            if (scenario.replaceInHistory) {
                expect(windowMock.location.replace).toHaveBeenCalledWith(expected);
            } else {
                expect(windowMock.location.href).withContext('unexpected location.href').toBe(expected);
            }
        });
    });
});
