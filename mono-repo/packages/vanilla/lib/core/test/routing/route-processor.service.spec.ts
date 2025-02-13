import { Injector } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Routes } from '@angular/router';

import { Mock, MockContext, Stub } from 'moxxi';

import { ProductService } from '../../public_api';
import { ROUTE_PROCESSOR } from '../../src/routing/route-processor';
import { RouteProcessorService } from '../../src/routing/route-processor.service';
import { ProductMetadataMock, ProductServiceMock } from '../products/product.mock';

@Mock({ of: ROUTE_PROCESSOR })
class RouteProcessorMock {
    @Stub() process: jasmine.Spy;
}

describe('RouteProcessorService', () => {
    let service: RouteProcessorService;
    let routeProcessorMock: RouteProcessorMock;
    let productServiceMock: ProductServiceMock;

    let routes: Routes[];
    let metadataMock: ProductMetadataMock;

    let injectorSpy: () => Injector;

    beforeEach(() => {
        routeProcessorMock = MockContext.createMock(RouteProcessorMock);
        productServiceMock = MockContext.createMock(ProductServiceMock);

        TestBed.configureTestingModule({
            providers: [
                MockContext.providers,
                { provide: ROUTE_PROCESSOR, useValue: routeProcessorMock, multi: true },
                { provide: ProductService, useValue: productServiceMock },
                RouteProcessorService,
            ],
        });

        productServiceMock.current = {
            ...productServiceMock.current,
            get injector(): Injector {
                return TestBed.inject(Injector);
            },
        };

        injectorSpy = jasmine.createSpy().and.callFake(() => TestBed.inject(Injector));

        metadataMock = {
            isRegistered: true,
            get injector(): Injector {
                return injectorSpy();
            },
        };

        productServiceMock.getMetadata.and.returnValue(metadataMock);

        routes = [[]];
        service = TestBed.inject(RouteProcessorService);
    });

    it('should process routes', () => {
        const childRoute = { path: 'c' };
        const parentRoute = { path: 'p', children: [childRoute] };
        routes[0]!.push(parentRoute);

        const processedChildRoute = { path: 'pc' };
        const processedParentRoute = { path: 'pp', children: [childRoute] };

        routeProcessorMock.process.withArgs(parentRoute).and.returnValue(processedParentRoute);
        routeProcessorMock.process.withArgs(childRoute).and.returnValue(processedChildRoute);

        const result = service.processRoutes(routes);

        expect(result).toEqual([{ path: 'pp', children: [{ path: 'pc' }] }]);
    });

    it('should delete route when processor returns null', () => {
        const childRoute = { path: 'c' };
        const parentRoute = { path: 'p', children: [childRoute] };
        routes[0]!.push(parentRoute);

        routeProcessorMock.process.withArgs(parentRoute).and.returnValue(null);

        const result = service.processRoutes(routes);

        expect(result).toEqual([]);
    });

    it('should delete child route when processor returns null', () => {
        const childRoute = { path: 'c' };
        const parentRoute = { path: 'p', children: [childRoute] };
        routes[0]!.push(parentRoute);

        const processedParentRoute = { path: 'pp', children: [childRoute] };

        routeProcessorMock.process.withArgs(parentRoute).and.returnValue(processedParentRoute);
        routeProcessorMock.process.withArgs(childRoute).and.returnValue(null);

        const result = service.processRoutes(routes);

        expect(result).toEqual([{ path: 'pp', children: [] }]);
        expect(productServiceMock.getMetadata).not.toHaveBeenCalled();
        expect(injectorSpy).not.toHaveBeenCalled();
    });

    it('should use product processors when called on child with route product', () => {
        const product = 'host';

        const childRoute = { path: 'c', data: { product } };
        const parentRoute = { path: 'p', children: [childRoute] };
        routes[0]!.push(parentRoute);

        const processedParentRoute = { path: 'pp', children: [childRoute] };

        routeProcessorMock.process.withArgs(parentRoute).and.returnValue(processedParentRoute);
        routeProcessorMock.process.withArgs(childRoute).and.returnValue(null);

        const result = service.processRoutes(routes);

        expect(result).toEqual([{ path: 'pp', children: [] }]);
        expect(productServiceMock.getMetadata).toHaveBeenCalledWith(product);
        expect(injectorSpy).toHaveBeenCalled();
    });

    it('should use product processors when called on child with parent route product', () => {
        const product = 'host';

        const childRoute = { path: 'c' };
        const parentRoute = { path: 'p', children: [childRoute], data: { product } };
        routes[0]!.push(parentRoute);

        const processedParentRoute = { path: 'pp', children: [childRoute] };

        routeProcessorMock.process.withArgs(parentRoute).and.returnValue(processedParentRoute);
        routeProcessorMock.process.withArgs(childRoute).and.returnValue(null);

        const result = service.processRoutes(routes);

        expect(result).toEqual([{ path: 'pp', children: [] }]);
        expect(productServiceMock.getMetadata).toHaveBeenCalledWith(product);
        expect(injectorSpy).toHaveBeenCalled();
    });

    it('should not use product processors if product is not registered', () => {
        const product = 'host';

        const childRoute = { path: 'c', data: { product } };
        const parentRoute = { path: 'p', children: [childRoute] };
        routes[0]!.push(parentRoute);

        metadataMock.isRegistered = false;

        const processedParentRoute = { path: 'pp', children: [childRoute] };

        routeProcessorMock.process.withArgs(parentRoute).and.returnValue(processedParentRoute);
        routeProcessorMock.process.withArgs(childRoute).and.returnValue(null);

        const result = service.processRoutes(routes);

        expect(result).toEqual([{ path: 'pp', children: [] }]);
        expect(productServiceMock.getMetadata).toHaveBeenCalledWith(product);
        expect(injectorSpy).not.toHaveBeenCalled();
    });
});
