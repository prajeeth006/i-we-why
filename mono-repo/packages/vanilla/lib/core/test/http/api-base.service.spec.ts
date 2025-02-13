import { HttpParams, HttpResponse, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HttpTestingController, TestRequest, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { ApiBase, ApiServiceFactory } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { LANG_ID } from '../../src/languages/languages.tokens';
import { ProductServiceMock } from '../products/product.mock';
import { LoadingIndicatorServiceMock } from './loading-indicator.mock';

class ApiService extends ApiBase {}

class CorsApiService extends ApiBase {}

class ProductApiService extends ApiBase {}

describe('ApiService', () => {
    let api: ApiService;
    let loadingIndicatorServiceMock: LoadingIndicatorServiceMock;
    let productServiceMock: ProductServiceMock;
    let actionUrl: string;
    let observableSpy: jasmine.Spy;
    let errorSpy: jasmine.Spy;
    let httpTestingController: HttpTestingController;
    let currentRequest: TestRequest | null;

    beforeEach(() => {
        productServiceMock = MockContext.useMock(ProductServiceMock);
        loadingIndicatorServiceMock = MockContext.useMock(LoadingIndicatorServiceMock);

        TestBed.configureTestingModule({
            imports: [],
            providers: [
                { provide: LANG_ID, useValue: 'en' },
                MockContext.providers,
                ApiServiceFactory,
                {
                    provide: ApiService,
                    deps: [ApiServiceFactory],
                    useFactory: (f: ApiServiceFactory) =>
                        f.create(ApiService, { product: 'product', area: 'prefix', forwardProductApiRequestHeader: true }),
                },
                {
                    provide: CorsApiService,
                    deps: [ApiServiceFactory],
                    useFactory: (f: ApiServiceFactory) =>
                        f.create(ApiService, { product: 'product', area: 'prefix', forwardProductApiRequestHeader: true }),
                },
                {
                    provide: ProductApiService,
                    deps: [ApiServiceFactory],
                    useFactory: (f: ApiServiceFactory) =>
                        f.createForProduct(ApiService, { product: 'product', area: 'prefix', forwardProductApiRequestHeader: true }),
                },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });

        actionUrl = '/en/prefix/api/action';

        api = TestBed.inject(ApiService);
        httpTestingController = TestBed.inject(HttpTestingController);

        observableSpy = jasmine.createSpy('observableSpy');
        errorSpy = jasmine.createSpy('errorSpy');
    });

    afterEach(() => {
        httpTestingController.verify();
        currentRequest = null;
    });

    function respond(status: number, body?: any) {
        if (!currentRequest) {
            currentRequest = httpTestingController.match(() => true)[0]!;
        }

        if (status === 200) {
            currentRequest.flush(body || {}, { status, statusText: 'OK' });
        } else {
            currentRequest.error(body, { status, statusText: 'ERROR' });
        }

        currentRequest = null;
    }

    function expectRequest(method: string, url: string, body?: any) {
        currentRequest = httpTestingController.expectOne(url);

        expect(currentRequest.request.method).toBe(method);

        if (body) {
            expect(currentRequest.request.body).toEqual(body);
        }
    }

    describe('get()', () => {
        it('should call http GET', () => {
            api.get('action').subscribe();

            expectRequest('GET', actionUrl);

            respond(200);
        });

        it('should call http GET with specified parameters', () => {
            api.get('action', { x: 'y' }).subscribe();

            expectRequest('GET', `${actionUrl}?x=y`);

            respond(200);
        });

        it('should call http get on absolute url', () => {
            const url = 'http://www.google.com/some/awesome/api';

            api.get(url).subscribe();

            expectRequest('GET', url);

            respond(200);
        });

        it('should call http get on absolute url with https', () => {
            const url = 'https://www.google.com/some/awesome/api';

            api.get(url).subscribe();

            expectRequest('GET', url);

            respond(200);
        });

        it('should notify subscribers after receiving a response', () => {
            api.get('action', {}).subscribe(observableSpy);

            respond(200);

            expect(observableSpy).toHaveBeenCalled();
        });

        it('should notify subscribers after receiving a response and pass response data by default', () => {
            const response = { prop: 'x' };

            api.get('action').subscribe(observableSpy);

            respond(200, response);

            expect(observableSpy).toHaveBeenCalledWith(response);
        });

        it('should notify subscribers after receiving a response and pass the response if resolveWithFullResponse is set to true', () => {
            const response = { prop: 'x' };

            api.get('action', null, { resolveWithFullResponse: true }).subscribe(observableSpy);

            respond(200, response);

            expect(observableSpy).toHaveBeenCalled();

            const res = <HttpResponse<any>>observableSpy.calls.mostRecent().args[0];

            expect(res.status).toBe(200);
            expect(res.body).toEqual(response);
        });

        it('should notify subscribers after receiving bad response and pass the error data by default', () => {
            const error = { message: 'error' };

            api.get('action').subscribe({
                next: () => {},
                error: observableSpy,
            });

            respond(400, error);

            expect(observableSpy).toHaveBeenCalledWith(error);
        });

        it('should notify subscribers after receiving bad response and pass the response if resolveWithFullResponse is set to true', () => {
            api.get('action', null, { resolveWithFullResponse: true }).subscribe({
                next: () => {},
                error: observableSpy,
            });

            respond(400);

            expect(observableSpy).toHaveBeenCalled();

            const res = <HttpResponse<any>>observableSpy.calls.mostRecent().args[0];

            expect(res.status).toBe(400);
        });

        it('should not show loading spinner by default', () => {
            api.get('action').subscribe();

            expect(loadingIndicatorServiceMock.start).not.toHaveBeenCalled();

            respond(200);
        });

        it('should show loading indicator when showSpinner is set to true and hide it after response is received', () => {
            api.get('action', null, { showSpinner: true }).subscribe();

            expect(loadingIndicatorServiceMock.start).toHaveBeenCalledWith({ url: 'action' });

            respond(200);

            expect(loadingIndicatorServiceMock.start.calls.mostRecent().returnValue.done).toHaveBeenCalled();
        });

        it('should use default options', () => {
            api.defaultOptions.resolveWithFullResponse = true;

            const response = { prop: 'y' };

            api.get('action').subscribe(observableSpy);

            respond(200, response);

            expect(observableSpy).toHaveBeenCalled();

            const res = <HttpResponse<any>>observableSpy.calls.mostRecent().args[0];

            expect(res.status).toBe(200);
            expect(res.body).toEqual(response);
        });

        it('should use default get options', () => {
            api.defaultGetOptions.showSpinner = true;

            api.get('action').subscribe();

            expect(loadingIndicatorServiceMock.start).toHaveBeenCalled();

            respond(200);
        });

        it('should allow empty prefix', () => {
            const apiFactory: ApiServiceFactory = TestBed.inject(ApiServiceFactory);
            const noPrefixApi = apiFactory.create(ApiService, { product: 'product', area: '', forwardProductApiRequestHeader: true });

            noPrefixApi.get('action').subscribe();

            expectRequest('GET', '/en/api/action');

            respond(200);
        });

        it('should support HttpParams', () => {
            api.get('action', new HttpParams().set('x', 'y')).subscribe();

            expectRequest('GET', `${actionUrl}?x=y`);

            respond(200);
        });

        it('should support array of parameters', () => {
            api.get('action', { x: ['y', 'z'] }).subscribe();

            expectRequest('GET', `${actionUrl}?x=y&x=z`);

            respond(200);
        });

        it('should add header "X-van-message-queue-scope" when option messageQueueScope is set', () => {
            api.get('action', undefined, { messageQueueScope: 'myscope' }).subscribe();
            expectRequest('GET', `${actionUrl}`);
            expect((currentRequest as any).request.headers.get('X-van-message-queue-scope')).toBe('myscope');
            respond(200);
        });

        it('should retry specified number of times and succeed', fakeAsync(() => {
            api.get('action', null, { retryCount: 2 }).subscribe({ next: observableSpy, error: errorSpy });

            respond(503);
            expect(errorSpy).not.toHaveBeenCalled();

            tick(500);
            respond(503);
            expect(errorSpy).not.toHaveBeenCalled();

            tick(500);
            respond(200);
            expect(observableSpy).toHaveBeenCalled();
        }));

        it('should retry specified number of times and fail', fakeAsync(() => {
            api.get('action', null, { retryCount: 2 }).subscribe({ next: observableSpy, error: errorSpy });

            respond(503);
            expect(errorSpy).not.toHaveBeenCalled();

            tick(500);
            respond(503);
            expect(errorSpy).not.toHaveBeenCalled();

            tick(500);
            respond(503);
            expect(errorSpy).toHaveBeenCalled();
        }));

        it('should not retry on not allowed status codes', fakeAsync(() => {
            api.get('action', null, { retryCount: 2, retryOnStatus: [400] }).subscribe({ next: observableSpy, error: errorSpy });

            respond(503);
            expect(errorSpy).toHaveBeenCalled();
        }));

        it('should retry only on allowed status codes (function)', fakeAsync(() => {
            api.get('action', null, { retryCount: 2, retryOnStatus: (s) => s === 500 }).subscribe({ next: observableSpy, error: errorSpy });

            respond(500);
            expect(errorSpy).not.toHaveBeenCalled();

            tick(500);
            respond(400);
            expect(errorSpy).toHaveBeenCalled();
        }));

        it('should retry in specified interval', fakeAsync(() => {
            api.get('action', null, { retryCount: 2, retryDelay: 200 }).subscribe({ next: observableSpy, error: errorSpy });

            respond(503);
            expect(errorSpy).not.toHaveBeenCalled();

            tick(200);
            respond(503);
            expect(errorSpy).not.toHaveBeenCalled();

            tick(200);
            respond(200);
            expect(observableSpy).toHaveBeenCalled();
        }));

        it('should retry in specified interval (function)', fakeAsync(() => {
            api.get('action', null, { retryCount: 2, retryDelay: (a) => a * 300 }).subscribe({ next: observableSpy, error: errorSpy });

            respond(503);
            expect(errorSpy).not.toHaveBeenCalled();

            tick(300);
            respond(503);
            expect(errorSpy).not.toHaveBeenCalled();

            tick(600);
            respond(200);
            expect(observableSpy).toHaveBeenCalled();
        }));
    });

    describe('request', () => {
        it('should call http specified method', () => {
            api.request('action', { method: 'GET' }).subscribe();

            expectRequest('GET', actionUrl);
            respond(200);

            api.request('action', { method: 'POST' }).subscribe();

            expectRequest('POST', actionUrl);
            respond(200);

            api.request('action', { method: 'PUT' }).subscribe();

            expectRequest('PUT', actionUrl);
            respond(200);

            api.request('action', { method: 'DELETE' }).subscribe();

            expectRequest('DELETE', actionUrl);
            respond(200);
        });

        it('should notify subscribers after receiving a response', () => {
            api.request('action', { method: 'POST' }).subscribe(observableSpy);

            respond(200);

            expect(observableSpy).toHaveBeenCalled();
        });

        it('should use default method options', () => {
            api.request('action', { method: 'GET' }).subscribe();

            expect(loadingIndicatorServiceMock.start).not.toHaveBeenCalled();

            respond(200);

            api.request('action', { method: 'POST' }).subscribe();

            expect(loadingIndicatorServiceMock.start).toHaveBeenCalled();

            respond(200);

            expect(loadingIndicatorServiceMock.start.calls.mostRecent().returnValue.done).toHaveBeenCalled();
        });

        it('should not show loading indicator when showSpinner is set to false', () => {
            api.request('action', { method: 'POST', showSpinner: false }).subscribe();

            expect(loadingIndicatorServiceMock.start).not.toHaveBeenCalled();

            respond(200);
        });

        it('should use default options', () => {
            api.defaultOptions.resolveWithFullResponse = true;

            const response = { prop: 'x' };

            api.request('action', { method: 'POST' }).subscribe(observableSpy);

            respond(200, response);

            expect(observableSpy).toHaveBeenCalled();

            const res = <HttpResponse<any>>observableSpy.calls.mostRecent().args[0];

            expect(res.status).toBe(200);
            expect(res.body).toEqual(response);
        });

        it('should throw error when method is not specified', () => {
            expect(() => api.request('action')).toThrowError(/request/);

            expect(() => api.request('action', {})).toThrowError(/request/);
        });

        // behavior of request is the same as get
    });

    describe('POST', () => {
        it('should call http POST', () => {
            api.post('action').subscribe();

            expectRequest('POST', actionUrl);

            respond(200);
        });

        it('should call http POST with specified parameters', () => {
            api.post('action', { x: 'y' }).subscribe();

            expectRequest('POST', actionUrl, { x: 'y' });

            respond(200);
        });

        it('should notify subscribers after receiving a response', () => {
            api.post('action', {}).subscribe(observableSpy);

            respond(200);

            expect(observableSpy).toHaveBeenCalled();
        });

        it('should show loading spinner by default and hide it after response is received', () => {
            api.post('action').subscribe();

            expect(loadingIndicatorServiceMock.start).toHaveBeenCalled();

            respond(200);

            expect(loadingIndicatorServiceMock.start.calls.mostRecent().returnValue.done).toHaveBeenCalled();
        });

        it('should not show loading indicator when showSpinner is set to false', () => {
            api.post('action', null, { showSpinner: false }).subscribe();

            expect(loadingIndicatorServiceMock.start).not.toHaveBeenCalled();

            respond(200);
        });

        it('should use default options', () => {
            api.defaultOptions.resolveWithFullResponse = true;

            const response = { prop: 'x' };

            api.post('action').subscribe(observableSpy);

            respond(200, response);

            expect(observableSpy).toHaveBeenCalled();

            const res = <HttpResponse<any>>observableSpy.calls.mostRecent().args[0];

            expect(res.status).toBe(200);
            expect(res.body).toEqual(response);
        });

        it('should use default post options', () => {
            api.defaultPostOptions.showSpinner = false;

            api.post('action').subscribe();

            expect(loadingIndicatorServiceMock.start).not.toHaveBeenCalled();

            respond(200);
        });

        // behavior of post is the same as get
    });

    describe('PUT', () => {
        it('should call http PUT', () => {
            api.put('action').subscribe();

            expectRequest('PUT', actionUrl);

            respond(200);
        });

        it('should call http PUT with specified parameters', () => {
            api.put('action', { x: 'y' }).subscribe();

            expectRequest('PUT', actionUrl, { x: 'y' });

            respond(200);
        });

        it('should notify subscribers after receiving a response', () => {
            api.put('action', {}).subscribe(observableSpy);

            respond(200);

            expect(observableSpy).toHaveBeenCalled();
        });

        it('should show loading spinner by default and hide it after response is received', () => {
            api.put('action').subscribe();

            expect(loadingIndicatorServiceMock.start).toHaveBeenCalled();

            respond(200);

            expect(loadingIndicatorServiceMock.start.calls.mostRecent().returnValue.done).toHaveBeenCalled();
        });

        it('should not show loading indicator when showSpinner is set to false', () => {
            api.put('action', null, { showSpinner: false }).subscribe();

            expect(loadingIndicatorServiceMock.start).not.toHaveBeenCalled();

            respond(200);
        });

        it('should use default options', () => {
            api.defaultOptions.resolveWithFullResponse = true;

            const response = { prop: 'x' };

            api.put('action').subscribe(observableSpy);

            respond(200, response);

            expect(observableSpy).toHaveBeenCalled();

            const res = <HttpResponse<any>>observableSpy.calls.mostRecent().args[0];

            expect(res.status).toBe(200);
            expect(res.body).toEqual(response);
        });

        it('should use default put options', () => {
            api.defaultPutOptions.showSpinner = false;

            api.put('action').subscribe();

            expect(loadingIndicatorServiceMock.start).not.toHaveBeenCalled();

            respond(200);
        });

        // behavior of put is the same as get
    });

    describe('DELETE', () => {
        it('should call http DELETE', () => {
            api.delete('action').subscribe();

            expectRequest('DELETE', actionUrl);

            respond(200);
        });

        it('should call http DELETE with specified parameters', () => {
            api.delete('action', { x: 'y' }).subscribe();

            expectRequest('DELETE', `${actionUrl}?x=y`);

            respond(200);
        });

        it('should notify subscribers after receiving a response', () => {
            api.delete('action', {}).subscribe(observableSpy);

            respond(200);

            expect(observableSpy).toHaveBeenCalled();
        });

        it('should show loading spinner by default and hide it after response is received', () => {
            api.delete('action').subscribe();

            expect(loadingIndicatorServiceMock.start).toHaveBeenCalled();

            respond(200);

            expect(loadingIndicatorServiceMock.start.calls.mostRecent().returnValue.done).toHaveBeenCalled();
        });

        it('should not show loading indicator when showSpinner is set to false', () => {
            api.delete('action', null, { showSpinner: false }).subscribe();

            expect(loadingIndicatorServiceMock.start).not.toHaveBeenCalled();

            respond(200);
        });

        it('should use default options', () => {
            api.defaultOptions.resolveWithFullResponse = true;

            const response = { prop: 'x' };

            api.delete('action').subscribe(observableSpy);

            respond(200, response);

            expect(observableSpy).toHaveBeenCalled();

            const res = <HttpResponse<any>>observableSpy.calls.mostRecent().args[0];

            expect(res.status).toBe(200);
            expect(res.body).toEqual(response);
        });

        it('should use default delete options', () => {
            api.defaultDeleteOptions.showSpinner = false;

            api.delete('action').subscribe();

            expect(loadingIndicatorServiceMock.start).not.toHaveBeenCalled();

            respond(200);
        });

        // behavior of put is the same as get
    });

    describe('cors', () => {
        beforeEach(() => {
            productServiceMock.isSingleDomainApp = true;
            productServiceMock.getMetadata.withArgs('product').and.returnValue({
                enabled: true,
                apiBaseUrl: 'http://base',
            });

            api = TestBed.inject(CorsApiService);
        });

        it('should use base url of specified product', () => {
            api.get('action').subscribe();

            expectRequest('GET', 'http://base/en/prefix/api/action');

            respond(200);
        });

        it('should ignore base url if prefix is absolute', () => {
            api.get('action', null, { prefix: 'http://prefix' }).subscribe();

            expectRequest('GET', 'http://prefix/api/action');

            respond(200);
        });
    });

    describe('product', () => {
        beforeEach(() => {
            productServiceMock.getMetadata.withArgs('product').and.returnValue({
                enabled: true,
                apiBaseUrl: 'http://base',
            });

            api = TestBed.inject(ProductApiService);
        });

        it('should use base url of product', () => {
            api.get('action').subscribe();

            expectRequest('GET', 'http://base/en/prefix/api/action');

            respond(200);
        });
    });
});
