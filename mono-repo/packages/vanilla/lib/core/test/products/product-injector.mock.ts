import { ProductInjector } from '@frontend/vanilla/core';
import { Mock, Stub } from 'moxxi';

@Mock({ of: ProductInjector })
export class ProductInjectorMock {
    @Stub() get: jasmine.Spy;
    @Stub() getMultiple: jasmine.Spy;
}
