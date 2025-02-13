import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuSection, UtilsService, WINDOW } from '@frontend/vanilla/core';
import { QuickDepositOptions } from '@frontend/vanilla/features/cashier';
import { TrustAsHtmlPipe } from '@frontend/vanilla/shared/browser';
import { MockContext } from 'moxxi';

import { WindowMock } from '../../../core/src/browser/window/test/window-ref.mock';
import { AppInfoConfigMock } from '../../../core/src/client-config/test/app-info-config.mock';
import { CommonMessagesMock } from '../../../core/src/client-config/test/common-messages.mock';
import { DeviceServiceMock } from '../../../core/test/browser/device.mock';
import { ElementRepositoryServiceMock } from '../../../core/test/browsercommon/element-repository.mock';
import { PageMock } from '../../../core/test/browsercommon/page.mock';
import { HtmlElementMock } from '../../../core/test/element-ref.mock';
import { LoggerMock } from '../../../core/test/languages/logger.mock';
import { UserServiceMock } from '../../../core/test/user/user.mock';
import { OverlayRefMock } from '../../../shared/overlay-factory/test/cdk-overlay.mock';
import { MenuItemsServiceMock } from '../../account-menu/test/menu-items.mock';
import { QuickDepositResponsiveComponent } from '../src/quick-deposit/quick-deposit-responsive.component';
import { QUICK_DEPOSIT_OPTIONS } from '../src/quick-deposit/quick-deposit.service';
import { CashierConfigMock } from './cashier.mock';

describe('QuickDepositResponsiveComponent', () => {
    let fixture: ComponentFixture<QuickDepositResponsiveComponent>;
    let component: QuickDepositResponsiveComponent;
    let cashierConfigMock: CashierConfigMock;
    let userServiceMock: UserServiceMock;
    let pageMock: PageMock;
    let appInfoConfigMock: AppInfoConfigMock;
    let elementRepositoryService: ElementRepositoryServiceMock;
    let quickDepositWrapperElem: HtmlElementMock;
    let iframeWrapperElem: HtmlElementMock;
    let overlayRefMock: OverlayRefMock;
    let deviceServiceMock: DeviceServiceMock;
    let menuItemsServiceMock: MenuItemsServiceMock;
    let windowMock: WindowMock;

    function init(quickDepositOptions: QuickDepositOptions) {
        cashierConfigMock = MockContext.useMock(CashierConfigMock);
        userServiceMock = MockContext.useMock(UserServiceMock);
        pageMock = MockContext.useMock(PageMock);
        appInfoConfigMock = MockContext.useMock(AppInfoConfigMock);
        elementRepositoryService = MockContext.useMock(ElementRepositoryServiceMock);
        overlayRefMock = MockContext.useMock(OverlayRefMock);
        deviceServiceMock = MockContext.useMock(DeviceServiceMock);
        menuItemsServiceMock = MockContext.useMock(MenuItemsServiceMock);
        windowMock = new WindowMock();
        MockContext.useMock(LoggerMock);
        MockContext.useMock(CommonMessagesMock);

        TestBed.overrideComponent(QuickDepositResponsiveComponent, {
            set: {
                imports: [TrustAsHtmlPipe],
                schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
                providers: [
                    MockContext.providers,
                    UtilsService,
                    {
                        provide: QUICK_DEPOSIT_OPTIONS,
                        useValue: quickDepositOptions,
                    },
                    {
                        provide: WINDOW,
                        useValue: windowMock,
                    },
                ],
            },
        });

        cashierConfigMock.host = 'https://cashier.unit.test';
        cashierConfigMock.quickDepositUrlTemplate =
            '/cashierapp/cashier.html?userId={0}&brandId={1}&productId={2}&channelId={3}&langId={4}&sessionKey={5}&parent={6}';
        cashierConfigMock.isQuickDepositEnabled = true;
        cashierConfigMock.singleSignOnIntegrationType = 'cookie';

        userServiceMock.id = 'userId';
        appInfoConfigMock.brand = 'brand';
        appInfoConfigMock.product = 'product';
        appInfoConfigMock.channel = 'channel';
        pageMock.lang = 'lang';
        userServiceMock.ssoToken = 'token';

        iframeWrapperElem = new HtmlElementMock();

        quickDepositWrapperElem = new HtmlElementMock();
        quickDepositWrapperElem.querySelector.and.callFake((selector: string) => {
            if (selector === '.player-quickdeposit-iframe-wrapper') {
                return iframeWrapperElem;
            }
            return null;
        });

        elementRepositoryService.get.and.callFake((elementKey: string) => {
            if (elementKey === 'QUICKDEPOSIT_WRAPPER') {
                return quickDepositWrapperElem;
            }
            return null;
        });
        windowMock.location.href = 'https://test.web.com/';

        fixture = TestBed.createComponent(QuickDepositResponsiveComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }

    it('should create component', () => {
        init({});
        expect(component).not.toBeUndefined();
        expect(component).not.toBeNull();
    });

    describe('ngOnInit', () => {
        const defaultQuerystring = {
            userId: 'userId',
            brandId: 'brand',
            productId: 'product',
            channelId: 'channel',
            langId: 'lang',
            parent: 'https%3A%2F%2Ftest.web.com%2F',
        };

        it('should open cashier url and store cookie', () => {
            init({});

            expect(component.url()).toStartWith('https://cashier.unit.test/cashierapp/cashier.html');
            expect(component.url()).toEndWith(toQuerystring(defaultQuerystring));
        });

        it('should open cashier url with appending "&showKYCVerifiedMessage=true"', () => {
            init({ showKYCVerifiedMessage: true });

            expect(component.url()).toStartWith('https://cashier.unit.test/cashierapp/cashier.html');
            expect(component.url()).toEndWith(
                toQuerystring({
                    ...defaultQuerystring,
                    showKYCVerifiedMessage: true,
                }),
            );
        });
    });

    describe('iframe post message', () => {
        it('with action "close" should hide component', () => {
            init({});
            component.close({ action: 'close', showAllOptions: 'false' });

            expect(overlayRefMock.detach).toHaveBeenCalled();
            expect(menuItemsServiceMock.setActive).toHaveBeenCalledWith(MenuSection.Menu, null);
        });

        it('with action "resize" should resize wrapper with posted values when media is "gt-xs"', () => {
            init({});
            component.resize({ action: 'resize', width: '100', height: '200' });

            expect(iframeWrapperElem.style.width).toBe('100px');
            expect(iframeWrapperElem.style.height).toBe('200px');
        });

        it('with action "resize" should resize wrapper with posted values when v2 is used', () => {
            init({});

            component.resize({ action: 'resize', width: '100', height: '200' });

            expect(iframeWrapperElem.style.width).toBe('100px');
            expect(iframeWrapperElem.style.height).toBe('200px');
        });

        it('with action "resize" should not set width when v2 and used mobile device', () => {
            init({});
            deviceServiceMock.isMobilePhone = true;

            component.resize({ action: 'resize', width: '100', height: '200' });

            expect(iframeWrapperElem.style.width).toBeUndefined();
            expect(iframeWrapperElem.style.height).toBe('200px');
        });
    });

    function toQuerystring(parameters: any): string {
        return (
            '?' +
            Object.keys(parameters)
                .map((key: string) => `${key}=${parameters[key]}`)
                .join('&')
        );
    }
});
