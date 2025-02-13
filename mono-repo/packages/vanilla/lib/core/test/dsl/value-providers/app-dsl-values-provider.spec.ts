import { TestBed } from '@angular/core/testing';

import { DslRecorderService, ProductMetadata } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { AppDslValuesProvider } from '../../../src/dsl/value-providers/app-dsl-values-provider';
import { PageMock } from '../../browsercommon/page.mock';
import { NativeAppServiceMock } from '../../native-app/native-app.mock';
import { ProductServiceMock } from '../../products/product.mock';
import { DslCacheServiceMock } from '../dsl-cache.mock';

describe('AppDslValuesProvider', () => {
    let provider: AppDslValuesProvider;
    let nativeAppServiceMock: NativeAppServiceMock;
    let productServiceMock: ProductServiceMock;
    let dslCacheServiceMock: DslCacheServiceMock;
    let pageMock: PageMock;

    beforeEach(() => {
        nativeAppServiceMock = MockContext.useMock(NativeAppServiceMock);
        productServiceMock = MockContext.useMock(ProductServiceMock);
        dslCacheServiceMock = MockContext.useMock(DslCacheServiceMock);
        pageMock = MockContext.useMock(PageMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, DslRecorderService, AppDslValuesProvider],
        });

        provider = TestBed.inject(AppDslValuesProvider);
        TestBed.inject(DslRecorderService).beginRecording();
    });

    describe('Context', () => {
        it('should match', () => {
            nativeAppServiceMock.context = 'iframe';

            const value = provider.getProviders()['App']!['Context'];

            expect(value).toEqual('iframe');
        });
    });

    describe('Theme', () => {
        it('should match', () => {
            pageMock.theme = 'black';

            const value = provider.getProviders()['App']!['Theme'];

            expect(value).toEqual('black');
        });
    });

    describe('Product', () => {
        it('should match', () => {
            productServiceMock.current.name = 'sports';

            const value = provider.getProviders()['App']!['Product'];

            expect(value).toEqual('sports');
        });

        it('should invalidate product when product changes', () => {
            productServiceMock.productChanged.next({ name: 'casino' } as ProductMetadata);
            expect(dslCacheServiceMock.invalidate).toHaveBeenCalledWith(['productChanged']);
        });
    });
});
