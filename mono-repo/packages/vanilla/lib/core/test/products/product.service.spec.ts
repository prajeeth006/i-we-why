import { Injector } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { ProductService, WINDOW } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { WindowMock } from '../../src/browser/window/test/window-ref.mock';
import { ProductsConfigMock } from './products-config.mock';

describe('ProductService', () => {
    let productService: ProductService;
    let productsConfigMock: ProductsConfigMock;
    let windowMock: WindowMock;

    beforeEach(() => {
        MockContext.disableAutoMock(ProductService);
        productsConfigMock = MockContext.useMock(ProductsConfigMock);
        windowMock = new WindowMock();

        TestBed.configureTestingModule({
            providers: [
                MockContext.providers,
                ProductService,
                {
                    provide: WINDOW,
                    useValue: windowMock,
                },
            ],
        });

        productService = TestBed.inject(ProductService);

        productsConfigMock['sports'] = {
            apiBaseUrl: 'http://sports',
            enabled: true,
            enabledProductApi: false,
        };
    });

    it('should create metadata base on config', () => {
        const metadata = productService.getMetadata('sports');

        expect(metadata.name).toBe('sports');
        expect(metadata.isEnabled).toBeTrue();
        expect(metadata.apiBaseUrl).toBe('http://sports');
    });

    it('should throw if the product is not configured', () => {
        expect(() => productService.getMetadata('blehproduct')).toThrowError();
    });

    it('should not be single domain', () => {
        expect(productService.isSingleDomainApp).toBeFalse();
    });

    it('should be single domain', () => {
        windowMock['SINGLE_DOMAIN'] = '1';
        expect(productService.isSingleDomainApp).toBeTrue();
    });

    describe('register()', () => {
        it('should store additional data on product registration', () => {
            const injector = Injector.create({
                providers: [],
                parent: TestBed.inject(Injector),
            });

            productService.register('sports', injector);

            const metadata = productService.getMetadata('sports');
            expect(metadata.injector).toBe(injector);
        });

        it('should throw when trying to access injector before the product has been registered', () => {
            expect(() => productService.getMetadata('sports').injector).toThrowError();
        });
    });

    describe('setActive()', () => {
        it('should throw if the product wasnt registered', () => {
            expect(() => productService.setActive('sports')).toThrowError();
        });

        describe('current', () => {
            it('should return active product metadata and send event', () => {
                const metadata = productService.getMetadata('sports');
                metadata.onRegister(<any>{});

                spyOn(productService.productChanged, 'next');
                productService.setActive('sports');

                expect(productService.current).toBe(productService.getMetadata('sports'));
                expect(productService.productChanged.next).toHaveBeenCalledWith(productService.current);
            });
        });
    });
});
