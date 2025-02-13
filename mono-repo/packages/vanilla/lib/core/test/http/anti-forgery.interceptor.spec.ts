import { HttpClient, HttpHeaders, HttpRequest, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { UserConfig } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { antiForgeryInterceptor } from '../../src/http/anti-forgery.interceptor';

describe('AntiForgeryInterceptor', () => {
    let userConfig: UserConfig;
    let client: HttpClient;
    let controller: HttpTestingController;

    beforeEach(() => {
        userConfig = new UserConfig();
        userConfig.xsrfToken = 'xxx';

        TestBed.configureTestingModule({
            providers: [
                MockContext.providers,
                provideHttpClient(withInterceptors([antiForgeryInterceptor])),
                provideHttpClientTesting(),
                { provide: UserConfig, useValue: userConfig },
            ],
        });

        client = TestBed.inject(HttpClient);
        controller = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        controller.verify();
    });

    testXsrf('GET', false);
    testXsrf('HEAD', false);
    testXsrf('POST', true);
    testXsrf('PUT', true);

    function testXsrf(method: string, result: boolean) {
        it(`should${result ? '' : ' not'} add xsrf header for ${method}`, () => {
            const request = new HttpRequest(method, 'url', null, {
                headers: new HttpHeaders().set('foo', 'bar'),
            });

            client.request(request).subscribe();
            const req = controller.expectOne('url');
            if (result) {
                expect(req.request.headers.get('X-XSRF-TOKEN')).toEqual('xxx');
            } else {
                expect(req.request.headers.get('X-XSRF-TOKEN')).toBeNull();
            }

            req.flush('');
        });
    }

    it('should not overwrite existing header', () => {
        const request = new HttpRequest('POST', 'url', null, {
            headers: new HttpHeaders().set('X-XSRF-TOKEN', 'bar'),
        });

        client.request(request).subscribe();
        const req = controller.expectOne('url');
        expect(req.request.headers.get('X-XSRF-TOKEN')).toEqual('bar');

        req.flush('');
    });
});
