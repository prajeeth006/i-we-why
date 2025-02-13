import { HttpClient, HttpRequest, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { rememberMeLogoutHttpInterceptor } from '../../../src/login/http-interceptors/remember-me-logout.http-interceptor';
import { CookieServiceMock } from '../../browser/cookie.mock';
import { UrlServiceMock } from '../../navigation/url.mock';
import { RememberMeServiceMock } from './remember-me.service.mock';

describe('RememberMeLogoutHttpInterceptor', () => {
    let rememberMeServiceMock: RememberMeServiceMock;
    let cookieServiceMock: CookieServiceMock;
    let urlServiceMock: UrlServiceMock;
    let httpReq: HttpRequest<any>;
    let client: HttpClient;
    let controller: HttpTestingController;

    beforeEach(() => {
        rememberMeServiceMock = MockContext.useMock(RememberMeServiceMock);
        urlServiceMock = MockContext.useMock(UrlServiceMock);
        cookieServiceMock = MockContext.useMock(CookieServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, provideHttpClient(withInterceptors([rememberMeLogoutHttpInterceptor])), provideHttpClientTesting()],
        });

        rememberMeServiceMock.tokenExists.and.returnValue(true);
        urlServiceMock.parse.and.returnValue({ isSameTopDomain: true });
        httpReq = new HttpRequest<any>('GET', 'http://bwin.com/api/auth/logout');

        client = TestBed.inject(HttpClient);
        controller = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        controller.verify();
    });

    describe('intercept()', () => {
        it('should remove remember-me in parallel', () => {
            client.request(httpReq).subscribe();
            const req = controller.expectOne('http://bwin.com/api/auth/logout');
            req.flush({});

            expect(rememberMeServiceMock.logout).toHaveBeenCalled();
        });

        shouldNotInterceptIf('not same top domain', () => urlServiceMock.parse.and.returnValue({ isSameTopDomain: false }));
        shouldNotInterceptIf('no tokens', () => rememberMeServiceMock.tokenExists.and.returnValue(false));
        shouldNotInterceptIf('not logout url', () => (httpReq = new HttpRequest<any>('GET', 'http://bwin.com/api/whatever')));
        shouldNotInterceptIf('is native', () => cookieServiceMock.get.and.returnValue('1'));

        function shouldNotInterceptIf(condition: string, setup: Function) {
            it('should not intercept if ' + condition, () => {
                setup();
                client.request(httpReq).subscribe();
                const req = controller.expectOne(
                    (req) => req.url.indexOf('http://bwin.com/api/auth/logout') > -1 || req.url.indexOf('http://bwin.com/api/whatever') > -1,
                );
                req.flush({});

                expect(rememberMeServiceMock.logout).not.toHaveBeenCalled();
            });
        }
    });
});
