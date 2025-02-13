import { TestBed } from '@angular/core/testing';

import { HomeService } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { TrackingServiceMock } from '../../../core/src/tracking/test/tracking.mock';
import { UrlServiceMock } from '../../../core/test/navigation/url.mock';
import { ProductHomepagesConfigMock } from '../../../core/test/products/product-homepages.client-config.mock';
import { PageMock } from '../browsercommon/page.mock';
import { LastKnownProductConfigMock } from '../last-known-product/last-known-product-config.mock';
import { LastKnownProductServiceMock } from '../last-known-product/last-known-product.mock';
import { NativeAppServiceMock } from '../native-app/native-app.mock';
import { NavigationServiceMock, ParsedUrlMock } from '../navigation/navigation.mock';

describe('HomeService', () => {
    let service: HomeService;
    let navigationServiceMock: NavigationServiceMock;
    let nativeAppServiceMock: NativeAppServiceMock;
    let pageMock: PageMock;
    let urlServiceMock: UrlServiceMock;
    let productHomepagesConfigMock: ProductHomepagesConfigMock;
    let lastKnownProductServiceMock: LastKnownProductServiceMock;

    beforeEach(() => {
        MockContext.useMock(TrackingServiceMock);
        navigationServiceMock = MockContext.useMock(NavigationServiceMock);
        nativeAppServiceMock = MockContext.useMock(NativeAppServiceMock);
        pageMock = MockContext.useMock(PageMock);
        urlServiceMock = MockContext.useMock(UrlServiceMock);
        productHomepagesConfigMock = MockContext.useMock(ProductHomepagesConfigMock);
        MockContext.useMock(LastKnownProductConfigMock);
        lastKnownProductServiceMock = MockContext.useMock(LastKnownProductServiceMock);
        TestBed.configureTestingModule({
            providers: [MockContext.providers, HomeService],
        });
    });

    beforeEach(() => {
        urlServiceMock.current.and.returnValue({ culture: pageMock.lang });
        service = TestBed.inject(HomeService);
    });

    describe('goTo()', () => {
        let parsedUrlMock: ParsedUrlMock;

        beforeEach(() => {
            parsedUrlMock = new ParsedUrlMock();
            urlServiceMock.parse.and.callFake(() => parsedUrlMock);
        });

        afterEach(() => {
            if (!nativeAppServiceMock.isNativeApp) {
                expect(parsedUrlMock.changeCulture).toHaveBeenCalledWith(pageMock.lang);
                expect(navigationServiceMock.goTo).toHaveBeenCalledWith(parsedUrlMock);
            }
        });

        it('should navigate to native app when isNativeApp', () => {
            nativeAppServiceMock.isNativeApp = true;
            service.goTo();
            expect(navigationServiceMock.goToNativeApp).toHaveBeenCalled();
        });

        it('should navigate to last known product', () => {
            lastKnownProductServiceMock.get.and.returnValue({ url: 'https://last.known.com/' });
            service.goTo();
            expect(urlServiceMock.parse).toHaveBeenCalledWith('https://last.known.com/');
        });

        it('should navigate to configured product homepage when isNativeWrapper', () => {
            nativeAppServiceMock.isNativeWrapper = true;
            nativeAppServiceMock.product = 'SPORTSBOOK';
            productHomepagesConfigMock.sports = 'https://native.wrapper.com/';
            service.goTo();
            expect(urlServiceMock.parse).toHaveBeenCalledWith(productHomepagesConfigMock.sports);
        });
    });
});
