import { Injectable, InjectionToken, Injector, Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { ProductInjector } from '../../src/products/product-injector';
import { ProductServiceMock } from './product.mock';

const TEST = new InjectionToken<TestService[]>('test');
const TEST2 = new InjectionToken<TestService[]>('test2');

@Injectable()
class TestService {}

@Injectable()
class TestServiceHost implements TestService {}

@Injectable()
class TestServiceProduct implements TestService {}

@Injectable()
class TestServiceProductOnly implements TestService {}

describe('ProductInjector', () => {
    let productInjector: ProductInjector;
    let productServiceMock: ProductServiceMock;

    beforeEach(() => {
        productServiceMock = MockContext.useMock(ProductServiceMock);

        TestBed.configureTestingModule({
            providers: [
                MockContext.providers,
                ProductInjector,
                { provide: TestService, useClass: TestServiceHost },
                { provide: TEST, useClass: TestServiceHost, multi: true },
            ],
        });

        const pj = Injector.create({
            providers: [
                { provide: TestServiceProductOnly, useClass: TestServiceProductOnly, deps: [] },
                { provide: TestService, useClass: TestServiceProduct, deps: [] },
                { provide: TEST, useClass: TestServiceProduct, multi: true, deps: [] },
            ],
            parent: TestBed.inject(Injector),
        });

        productServiceMock.current.injector = pj;

        productInjector = TestBed.inject(ProductInjector);
    });

    it('should resolve from host', () => {
        productServiceMock.current.isHost = true;

        verifyType(productInjector.get(TestService), TestServiceHost);
    });

    it('should resolve from product', () => {
        productServiceMock.current.isHost = false;

        verifyType(productInjector.get(TestService), TestServiceProduct);
    });

    it('should not resolve product only from host', () => {
        productServiceMock.current.isHost = true;

        expect(productInjector.get(TestServiceProductOnly, 'x')).toBe('x');
    });

    it('should resolve multiple from host', () => {
        productServiceMock.current.isHost = true;

        const services = productInjector.getMultiple(TEST);

        expect(services.length).toBe(1);
        verifyType(services[0], TestServiceHost);
    });

    it('should resolve multiple from product', () => {
        productServiceMock.current.isHost = false;

        const services = productInjector.getMultiple(TEST);

        expect(services.length).toBe(2);
        verifyType(services[0], TestServiceHost);
        verifyType(services[1], TestServiceProduct);
    });

    it('multiple providers should be optional', () => {
        productServiceMock.current.isHost = false;

        const services = productInjector.getMultiple(TEST2);

        expect(services.length).toBe(0);
    });

    function verifyType(instance: any, type: Type<any>) {
        if (!(instance instanceof type)) {
            fail(`Expected instance to be of type ${type} but was ${instance}`);
        }
    }
});
