import { TestBed } from '@angular/core/testing';

import { DslRecordable, DslRecorderService } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { ShopDslValuesProvider } from '../../../src/dsl/value-providers/shop-dsl-values-provider';
import { CookieServiceMock } from '../../browser/cookie.mock';
import { DslValueAsyncResolverMock } from './dsl-value-async-resolver.mock';

describe('ShopDslValuesProvider', () => {
    let target: DslRecordable;
    let dslValueAsyncResolverMock: DslValueAsyncResolverMock;
    let cookieServiceMock: CookieServiceMock;

    beforeEach(() => {
        dslValueAsyncResolverMock = MockContext.useMock(DslValueAsyncResolverMock);
        cookieServiceMock = MockContext.useMock(CookieServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, DslRecorderService, ShopDslValuesProvider],
        });

        const provider = TestBed.inject(ShopDslValuesProvider);
        TestBed.inject(DslRecorderService).beginRecording();

        cookieServiceMock.get.withArgs('shop_id').and.returnValue('1');
        dslValueAsyncResolverMock.resolve.and.returnValue({
            businessUnit: 'bis',
            country: 'BiH',
            currencyCode: 'Her',
            defaultGateway: 'tre',
            locale: 'gacko',
            regionAreaCode: '3966+',
            regionCode: '3325',
            shopId: '1',
            shopTier: 36,
            subRegionCode: '99',
            timeZone: 'best',
            validated: true,
            sitecoreShopGroups: "'CRICKET', 'FOOTBALL'",
        });

        target = provider.getProviders()['Shop']!;
    });

    it('should resolve', () => {
        expect(target['BusinessUnit']).toBe('bis');
        expect(target['Country']).toBe('BiH');
        expect(target['CurrencyCode']).toBe('Her');
        expect(target['DefaultGateway']).toBe('tre');
        expect(target['Locale']).toBe('gacko');
        expect(target['RegionAreaCode']).toBe('3966+');
        expect(target['RegionCode']).toBe('3325');
        expect(target['ShopId']).toBe('1');
        expect(target['ShopTier']).toBe(36);
        expect(target['SubRegionCode']).toBe('99');
        expect(target['TimeZone']).toBe('best');
        expect(target['Validated']).toBeTrue();
        expect(target['SitecoreShopGroups']).toBe("'CRICKET', 'FOOTBALL'");
    });
});
