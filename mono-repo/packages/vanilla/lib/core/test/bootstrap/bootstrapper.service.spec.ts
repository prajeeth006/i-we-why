import { Injector } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BootstrapperService, OnAppInit, ProductBootstrapper, runOnAppInit } from '@frontend/vanilla/core';
import { MockContext, Stub } from 'moxxi';

import { PRODUCT_BOOTSTRAPPER } from '../../src/bootstrap/bootstrapper.service';
import { ProductServiceMock } from '../products/product.mock';

export class TestOnAppInitBootstrapper implements OnAppInit {
    @Stub() onAppInit: jasmine.Spy;
}

export class TestProductBootstrapper implements ProductBootstrapper {
    @Stub() onLoad: jasmine.Spy;
    @Stub() onActivate: jasmine.Spy;
    @Stub() onDeactivate: jasmine.Spy;
}

describe('BootstrapperService', () => {
    let service: BootstrapperService;
    let productServiceMock: ProductServiceMock;
    let testOnAppInitBootstrapper: TestOnAppInitBootstrapper;
    let testProductBootstrapper: TestProductBootstrapper;

    beforeEach(() => {
        productServiceMock = MockContext.useMock(ProductServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, BootstrapperService, runOnAppInit(TestOnAppInitBootstrapper)],
        });

        const productInjector = Injector.create({
            providers: [
                { provide: TestProductBootstrapper, deps: [] },
                { provide: PRODUCT_BOOTSTRAPPER, useExisting: TestProductBootstrapper, multi: true },
            ],
            parent: TestBed.inject(Injector),
        });

        productServiceMock.getMetadata.withArgs('product').and.returnValue({
            injector: productInjector,
        });

        service = TestBed.inject(BootstrapperService);
        testOnAppInitBootstrapper = TestBed.inject(TestOnAppInitBootstrapper);
        testProductBootstrapper = productInjector.get(TestProductBootstrapper);
    });

    describe('runAppInit()', () => {
        it('should run bootstrappers', async () => {
            await service.runAppInit();

            expect(testOnAppInitBootstrapper.onAppInit).toHaveBeenCalled();
        });
    });

    describe('runProductLoad()', () => {
        it('should run bootstrappers', async () => {
            await service.runProductLoad('product');

            expect(testProductBootstrapper.onLoad).toHaveBeenCalled();
        });
    });

    describe('runProductActivation()', () => {
        it('should run bootstrappers', async () => {
            await service.runProductActivation('product');

            expect(testProductBootstrapper.onActivate).toHaveBeenCalled();
        });
    });

    describe('runProductDeactivation()', () => {
        it('should run bootstrappers', async () => {
            await service.runProductDeactivation('product');

            expect(testProductBootstrapper.onDeactivate).toHaveBeenCalled();
        });
    });
});
