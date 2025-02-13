import { ProductInjector } from '@frontend/vanilla/core';
import { MockService } from 'ng-mocks';

export const ProductInjectorMock = MockService(ProductInjector, {
    get: jest.fn(),
    getMultiple: jest.fn(),
});
