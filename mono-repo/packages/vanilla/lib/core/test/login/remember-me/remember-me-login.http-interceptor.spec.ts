import { HttpClient, HttpRequest, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { SKIP_LOGIN_REDIRECT, rememberMeLoginHttpInterceptor } from '../../../src/login/http-interceptors/remember-me-login.http-interceptor';
import { LoggerMock } from '../../languages/logger.mock';
import { UrlServiceMock } from '../../navigation/url.mock';
import { RememberMeConfigMock } from './remember-me.config.mock';
import { RememberMeLoginServiceMock, RememberMeServiceMock } from './remember-me.service.mock';

describe('RememberMeLoginHttpInterceptor', () => {
    let rememberMeServiceMock: RememberMeServiceMock;
    let rememberMeLoginServiceMock: RememberMeLoginServiceMock;
    let urlServiceMock: UrlServiceMock;
    let configMock: RememberMeConfigMock;
    let log: LoggerMock;
    let httpReq: HttpRequest<any>;
    let spy: jasmine.Spy;
    let client: HttpClient;
    let controller: HttpTestingController;

    beforeEach(() => {
        rememberMeServiceMock = MockContext.useMock(RememberMeServiceMock);
        rememberMeLoginServiceMock = MockContext.useMock(RememberMeLoginServiceMock);
        urlServiceMock = MockContext.useMock(UrlServiceMock);
        log = MockContext.useMock(LoggerMock);
        configMock = MockContext.useMock(RememberMeConfigMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, provideHttpClient(withInterceptors([rememberMeLoginHttpInterceptor])), provideHttpClientTesting()],
        });

        rememberMeServiceMock.tokenExists.and.returnValue(true);
        urlServiceMock.parse.and.returnValue({ isSameTopDomain: true });
        httpReq = new HttpRequest<any>('GET', 'http://bwin.com/api/whatever');
        spy = jasmine.createSpy();

        client = TestBed.inject(HttpClient);
        controller = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        expect(rememberMeServiceMock.login).not.toHaveBeenCalled();
        controller.verify();
    });

    describe('intercept()', () => {
        it(`should transparently login and retry the request 401 response code`, () => {
            client.request(httpReq).subscribe();
            const req = controller.expectOne('http://bwin.com/api/whatever');
            req.flush({}, { status: 401, statusText: 'error' });

            expect(rememberMeLoginServiceMock.loginWithToken).toHaveBeenCalled();

            rememberMeLoginServiceMock.loginWithToken.completeWith(true);

            expect(log.infoRemote).toHaveBeenCalled();
            const retryRequest = controller.expectOne('http://bwin.com/api/whatever');
            retryRequest.flush({}, { status: 200, statusText: 'error' });
            expect(req.request.context.get(SKIP_LOGIN_REDIRECT)).toBeTrue();
        });

        it(`should skip retry if listed in config`, () => {
            configMock.skipRetryPaths = ['/whatever'];
            client.request(httpReq).subscribe();
            const req = controller.expectOne('http://bwin.com/api/whatever');
            req.flush({}, { status: 401, statusText: 'error' });

            expect(rememberMeLoginServiceMock.loginWithToken).toHaveBeenCalled();

            rememberMeLoginServiceMock.loginWithToken.completeWith(true);

            expect(log.infoRemote).toHaveBeenCalled();
            expect(req.request.context.get(SKIP_LOGIN_REDIRECT)).toBeTrue();
        });

        it(`should proceed only if loginWithToken call executed`, () => {
            client.request(httpReq).subscribe();
            const req = controller.expectOne('http://bwin.com/api/whatever');
            req.flush({}, { status: 401, statusText: 'error' });

            expect(rememberMeLoginServiceMock.loginWithToken).toHaveBeenCalled();
            rememberMeLoginServiceMock.loginWithToken.completeWith(false);

            expect(log.infoRemote).not.toHaveBeenCalled();
        });

        it('should login only once concurrently', fakeAsync(() => {
            client.request(httpReq).subscribe();
            const req = controller.expectOne('http://bwin.com/api/whatever');
            req.flush({}, { status: 401, statusText: 'error' });

            const httpReq2 = new HttpRequest<any>('GET', 'http://bwin.com/api/whatever1');
            client.request(httpReq2).subscribe();
            const req2 = controller.expectOne('http://bwin.com/api/whatever1');
            req2.flush({}, { status: 401, statusText: 'error' });

            expect(rememberMeLoginServiceMock.loginWithToken).toHaveBeenCalledTimes(1);
            tick();
            rememberMeLoginServiceMock.loginWithToken.completeWith(true);

            const retryRequest = controller.expectOne('http://bwin.com/api/whatever');
            retryRequest.flush({}, { status: 200, statusText: 'error' });
            const retryRequest2 = controller.expectOne('http://bwin.com/api/whatever1');
            retryRequest2.flush({}, { status: 200, statusText: 'error' });
        }));

        it('should pass through if not auth error', () => {
            client.request(httpReq).subscribe();
            const req = controller.expectOne('http://bwin.com/api/whatever');
            req.flush({}, { status: 500, statusText: 'error' });

            expect(rememberMeLoginServiceMock.loginWithToken).not.toHaveBeenCalled();
        });

        it('should pass through if no error', () => {
            client.request(httpReq).subscribe();
            const req = controller.expectOne('http://bwin.com/api/whatever');
            req.flush({});

            expect(rememberMeLoginServiceMock.loginWithToken).not.toHaveBeenCalled();
        });

        it('should fail with 401 error if rememer-me login fails', () => {
            client.request(httpReq).subscribe({ error: spy });
            const req = controller.expectOne('http://bwin.com/api/whatever');
            req.flush({}, { status: 401, statusText: 'error' });

            expect(rememberMeLoginServiceMock.loginWithToken).toHaveBeenCalled();

            waitForAsync(() => {
                rememberMeLoginServiceMock.loginWithToken.error('loginError'); // act
                expect(log.errorRemote).toHaveBeenCalledWith(
                    'Failed login by remember-me token on session expiration. User gets unauthenticated.',
                    'loginError',
                );
                expect(spy).toHaveBeenCalledWith(jasmine.objectContaining({ status: 401 }));
                expect(rememberMeServiceMock.callInProgress).toBeFalse();
                expect(req.request.context.get(SKIP_LOGIN_REDIRECT)).toBeFalse();
            });
        });

        it('should not intercept if not on same top domain', () => {
            urlServiceMock.parse.and.returnValue({ isSameTopDomain: false });
            client.request(httpReq).subscribe(spy);
            const req = controller.expectOne('http://bwin.com/api/whatever');
            req.flush({});

            expect(spy).toHaveBeenCalledWith(jasmine.objectContaining({ status: 200, statusText: 'OK', url: 'http://bwin.com/api/whatever' }));
        });

        it('should not intercept if no tokens', () => {
            rememberMeServiceMock.tokenExists.and.returnValue(false);

            client.request(httpReq).subscribe(spy);
            const req = controller.expectOne('http://bwin.com/api/whatever');
            req.flush({});

            expect(spy).toHaveBeenCalledWith(jasmine.objectContaining({ status: 200, statusText: 'OK', url: 'http://bwin.com/api/whatever' }));
        });
    });
});
