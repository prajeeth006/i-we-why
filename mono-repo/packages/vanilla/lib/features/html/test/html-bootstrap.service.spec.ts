import { TestBed } from '@angular/core/testing';

import { UserUpdateEvent } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { DeviceServiceMock } from '../../../core/test/browser/device.mock';
import { HtmlNodeMock } from '../../../core/test/browser/html-node.mock';
import { PageMock } from '../../../core/test/browsercommon/page.mock';
import { NativeAppServiceMock } from '../../../core/test/native-app/native-app.mock';
import { ProductServiceMock } from '../../../core/test/products/product.mock';
import { UserServiceMock } from '../../../core/test/user/user.mock';
import { HtmlBootstrapService } from '../src/html-bootstrap.service';

type C =
    | 'device-mobile'
    | 'device-tablet'
    | 'device-mobile-phone'
    | 'device-touch'
    | 'device-desktop'
    | 'native-download-client-app'
    | 'native-download-client-wrapper'
    | 'native-app'
    | 'native-wrapper'
    | 'native-wrapper-odr';

describe('HtmlBootstrapService', () => {
    let service: HtmlBootstrapService;
    let htmlNodeMock: HtmlNodeMock;
    let deviceServiceMock: DeviceServiceMock;
    let nativeAppServiceMock: NativeAppServiceMock;
    let pageMock: PageMock;
    let productServiceMock: ProductServiceMock;
    let userMock: UserServiceMock;

    beforeEach(() => {
        pageMock = MockContext.useMock(PageMock);
        productServiceMock = MockContext.useMock(ProductServiceMock);
        htmlNodeMock = MockContext.useMock(HtmlNodeMock);
        deviceServiceMock = MockContext.useMock(DeviceServiceMock);
        nativeAppServiceMock = MockContext.useMock(NativeAppServiceMock);
        userMock = MockContext.useMock(UserServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, HtmlBootstrapService],
        });

        pageMock.theme = 'black';
        pageMock.itemPathDisplayModeEnabled = true;
        service = TestBed.inject(HtmlBootstrapService);
    });

    describe('OnFeatureInit', () => {
        // mobile phone
        testClasses(
            (d) => {
                d.isMobilePhone = true;
                d.isMobile = true;
                d.isTablet = false;
                d.isTouch = true;
            },
            ['device-mobile', 'device-mobile-phone', 'device-touch'],
        );
        // tablet
        testClasses(
            (d) => {
                d.isMobilePhone = false;
                d.isMobile = true;
                d.isTablet = true;
                d.isTouch = true;
            },
            ['device-mobile', 'device-tablet', 'device-touch'],
        );
        // desktop
        testClasses(
            (d) => {
                d.isMobilePhone = false;
                d.isMobile = false;
                d.isTablet = false;
                d.isTouch = false;
            },
            ['device-desktop'],
        );
        // desktop with touch
        testClasses(
            (d) => {
                d.isMobilePhone = false;
                d.isMobile = false;
                d.isTablet = false;
                d.isTouch = true;
            },
            ['device-desktop', 'device-touch'],
        );

        testClasses(
            (d, m) => {
                desktop(d);
                m.isNativeApp = true;
            },
            ['device-desktop', 'native-app'],
        );
        testClasses(
            (d, m) => {
                desktop(d);
                m.isNativeWrapper = true;
            },
            ['device-desktop', 'native-wrapper'],
        );
        testClasses(
            (d, m) => {
                desktop(d);
                m.isNativeWrapper = true;
                m.isNativeWrapperODR = true;
            },
            ['device-desktop', 'native-wrapper-odr'],
        );
        testClasses(
            (d, m) => {
                desktop(d);
                m.isDownloadClientApp = true;
            },
            ['device-desktop', 'native-download-client-app'],
        );
        testClasses(
            (d, m) => {
                desktop(d);
                m.isDownloadClientWrapper = true;
            },
            ['device-desktop', 'native-download-client-wrapper'],
        );

        function testClasses(setup: (d: DeviceServiceMock, n: NativeAppServiceMock) => void, classes: C[]) {
            it('should add classes on html', () => {
                setup(deviceServiceMock, nativeAppServiceMock);

                service.onFeatureInit();

                expect(htmlNodeMock.setCssClass).toHaveBeenCalledTimes(16);
                [
                    'device-mobile',
                    'device-tablet',
                    'device-mobile-phone',
                    'device-touch',
                    'device-desktop',
                    'native-download-client-app',
                    'native-download-client-wrapper',
                    'native-app',
                    'native-wrapper',
                    'native-wrapper-odr',
                ].forEach((c) => expect(htmlNodeMock.setCssClass).toHaveBeenCalledWith(c, classes.indexOf(<C>c) !== -1));
            });
        }

        function desktop(d: DeviceServiceMock) {
            d.isMobilePhone = false;
            d.isMobile = false;
            d.isTablet = false;
            d.isTouch = false;
        }

        it('should set css class on html node when user is updated with isAuthenticated or workflowType', () => {
            userMock.isAuthenticated = false;
            userMock.workflowType = 0;

            service.onFeatureInit();

            expectCssClass('unauthenticated');

            userMock.workflowType = 1;
            userMock.triggerEvent(new UserUpdateEvent(new Map([['workflowType', 1]])));

            expectCssClass(['unauthenticated', 'has-workflow']);

            userMock.isAuthenticated = true;
            userMock.workflowType = 0;

            userMock.triggerEvent(
                new UserUpdateEvent(
                    new Map<string, any>([
                        ['isAuthenticated', true],
                        ['workflowType', 0],
                    ]),
                ),
            );

            expectCssClass('authenticated');

            userMock.isAuthenticated = false;

            userMock.triggerEvent(new UserUpdateEvent(new Map<string, any>([['isAuthenticated', false]])));

            expectCssClass('unauthenticated');
        });

        it('should not update when user is updated with different property', () => {
            userMock.isAuthenticated = false;
            userMock.workflowType = 0;

            service.onFeatureInit();

            expectCssClass('unauthenticated');

            userMock.triggerEvent(new UserUpdateEvent(new Map([['username', 'sa']])));

            expect(htmlNodeMock.setCssClass).not.toHaveBeenCalled();
        });

        it('should set data-country attribute', () => {
            userMock.isAuthenticated = true;
            userMock.country = 'AT';

            service.onFeatureInit();

            expect(htmlNodeMock.setAttribute).toHaveBeenCalledWith('data-country', 'AT');
        });

        it('should not set data-country attribute when user is not authenticated', () => {
            userMock.isAuthenticated = false;
            userMock.country = 'AT';

            service.onFeatureInit();

            expect(htmlNodeMock.setAttribute).toHaveBeenCalledWith('data-country', null);
        });

        it('should update data-country attribute when it updates', () => {
            service.onFeatureInit();

            userMock.country = 'XX';
            userMock.triggerEvent(new UserUpdateEvent(new Map([['country', 'XX']])));

            expect(htmlNodeMock.setAttribute).toHaveBeenCalledWith('data-country', 'XX');

            userMock.isAuthenticated = false;
            userMock.triggerEvent(new UserUpdateEvent(new Map([['isAuthenticated', false]])));

            expect(htmlNodeMock.setAttribute).toHaveBeenCalledWith('data-country', undefined);
        });

        it('should set theme class', () => {
            service.onFeatureInit();

            expect(htmlNodeMock.setCssClass).toHaveBeenCalledWith('th-black', true);
        });

        it('should set item-path-enabled class is enabled', () => {
            pageMock.itemPathDisplayModeEnabled = true;

            service.onFeatureInit();

            expect(htmlNodeMock.setCssClass).toHaveBeenCalledWith('item-path-enabled', true);
        });

        it('should set product for non single domain', () => {
            pageMock.product = 'sports';

            service.onFeatureInit();

            expect(htmlNodeMock.setCssClass).toHaveBeenCalledWith('product-sports', true);
        });

        it('should not set product for single domain', () => {
            pageMock.product = 'sports';
            productServiceMock.isSingleDomainApp = true;

            service.onFeatureInit();

            expect(htmlNodeMock.setCssClass).not.toHaveBeenCalledWith('product-sports', true);
        });

        function expectCssClass(c: string | string[]) {
            const ca = c instanceof Array ? c : [c];
            const classes = ['unauthenticated', 'authenticated', 'has-workflow'];

            const notClasses = classes.filter((cl) => ca.indexOf(cl) === -1);

            for (const cl of ca) {
                expect(htmlNodeMock.setCssClass).toHaveBeenCalledWith(cl, true);
            }

            for (const cl of notClasses) {
                expect(htmlNodeMock.setCssClass).toHaveBeenCalledWith(cl, false);
            }

            htmlNodeMock.setCssClass.calls.reset();
        }
    });
});
