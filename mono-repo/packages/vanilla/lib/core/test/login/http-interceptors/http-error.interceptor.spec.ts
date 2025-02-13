import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed, waitForAsync } from '@angular/core/testing';

import { MessageLifetime, MessageScope, NativeEventType, UserSessionExpiredEvent } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { CommonMessagesMock } from '../../../src/client-config/test/common-messages.mock';
import { httpErrorInterceptor } from '../../../src/login/http-interceptors/http-error.interceptor';
import { SKIP_LOGIN_REDIRECT } from '../../../src/login/http-interceptors/remember-me-login.http-interceptor';
import { TrackingServiceMock } from '../../../src/tracking/test/tracking.mock';
import { LocalStoreServiceMock } from '../../browser/local-store.mock';
import { LoggerMock } from '../../languages/logger.mock';
import { MessageQueueServiceMock } from '../../messages/message-queue.mock';
import { NativeAppServiceMock } from '../../native-app/native-app.mock';
import { ParsedUrlMock } from '../../navigation/navigation.mock';
import { UrlServiceMock } from '../../navigation/url.mock';
import { UserServiceMock } from '../../user/user.mock';
import { LoginService2Mock } from '../login-service.mock';
import { LoginStoreServiceMock } from '../login-store.mock';
import { LoginNavigationServiceMock } from '../navigation-service.mocks';

describe('HttpErrorInterceptor', () => {
    let userServiceMock: UserServiceMock;
    let loggerMock: LoggerMock;
    let nativeAppServiceMock: NativeAppServiceMock;
    let messageQueueServiceMock: MessageQueueServiceMock;
    let commonMessagesMock: CommonMessagesMock;
    let loginService2Mock: LoginService2Mock;
    let loginStoreServiceMock: LoginStoreServiceMock;
    let trackingServiceMock: TrackingServiceMock;
    let urlServiceMock: UrlServiceMock;
    let userEventSpy: jasmine.Spy;
    let client: HttpClient;
    let controller: HttpTestingController;
    let parsedUrl: ParsedUrlMock;
    let localStoreServiceMock: LocalStoreServiceMock;

    beforeEach(() => {
        userServiceMock = MockContext.useMock(UserServiceMock);
        loggerMock = MockContext.useMock(LoggerMock);
        nativeAppServiceMock = MockContext.useMock(NativeAppServiceMock);
        messageQueueServiceMock = MockContext.useMock(MessageQueueServiceMock);
        commonMessagesMock = MockContext.useMock(CommonMessagesMock);
        loginService2Mock = MockContext.useMock(LoginService2Mock);
        loginStoreServiceMock = MockContext.useMock(LoginStoreServiceMock);
        trackingServiceMock = MockContext.useMock(TrackingServiceMock);
        urlServiceMock = MockContext.useMock(UrlServiceMock);
        localStoreServiceMock = MockContext.useMock(LocalStoreServiceMock);
        MockContext.useMock(LoginNavigationServiceMock);

        userEventSpy = jasmine.createSpy();

        TestBed.configureTestingModule({
            providers: [MockContext.providers, provideHttpClient(withInterceptors([httpErrorInterceptor])), provideHttpClientTesting()],
        });

        commonMessagesMock.SessionError = 'Error';
        loginStoreServiceMock.PostLoginValues = 'postLoginValues';
        userServiceMock.events.subscribe(userEventSpy);

        parsedUrl = new ParsedUrlMock();
        urlServiceMock.parse.and.returnValue(parsedUrl);

        client = TestBed.inject(HttpClient);
        controller = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        controller.verify();
    });

    describe('responseError()', () => {
        describe('with status 401 from another domain', () => {
            it('should skip', () => {
                parsedUrl.isSameTopDomain = false;
                client.get('url').subscribe();
                const req = controller.expectOne('url');
                req.flush({}, { status: 401, statusText: 'ERROR' });

                expect(loggerMock.warnRemote).not.toHaveBeenCalled();
                expect(userEventSpy).not.toHaveBeenCalledWith(jasmine.any(UserSessionExpiredEvent));
            });
        });
        describe('with status 401 with SKIP_LOGIN_REDIRECT true', () => {
            it('should skip', () => {
                client.get('url').subscribe();
                const req = controller.expectOne('url');
                req.request.context.set(SKIP_LOGIN_REDIRECT, true);
                req.flush({}, { status: 401, statusText: 'ERROR' });

                expect(loggerMock.warnRemote).not.toHaveBeenCalled();
                expect(userEventSpy).not.toHaveBeenCalledWith(jasmine.any(UserSessionExpiredEvent));
            });
        });
        describe('with status 401', () => {
            beforeEach(() => {
                parsedUrl.isSameTopDomain = true;
                client.get('url').subscribe();
                const req = controller.expectOne('url');
                req.flush({}, { status: 401, statusText: 'ERROR' });
            });

            it('should log error', () => {
                expect(loggerMock.warnRemote).toHaveBeenCalled();
            });

            it('should emit user event', () => {
                expect(userEventSpy).toHaveBeenCalledWith(jasmine.any(UserSessionExpiredEvent));
            });

            it('should remove postLoginValues cookie', () => {
                expect(loginStoreServiceMock.PostLoginValues).toEqual(null);
            });

            it('should add error messages to message queue', () => {
                expect(messageQueueServiceMock.clear).toHaveBeenCalledWith({ clearPersistent: false });
                expect(messageQueueServiceMock.addError).toHaveBeenCalledWith(
                    commonMessagesMock.SessionError,
                    MessageLifetime.Single,
                    MessageScope.Login,
                );
            });

            it('should navigate to login', () => {
                waitForAsync(() =>
                    expect(loginService2Mock.goTo).toHaveBeenCalledWith({
                        appendReferrer: true,
                        forceReload: true,
                        storeMessageQueue: true,
                    }),
                );
            });

            it('should track ', () => {
                parsedUrl.isSameTopDomain = true;
                client.get('url').subscribe();
                const req = controller.expectOne('url');
                req.flush({}, { status: 401, statusText: 'ERROR' });

                expect(trackingServiceMock.reportErrorObject).toHaveBeenCalledWith({
                    type: 'LoginError',
                    message: 'user session expired',
                    code: 401,
                });
            });
        });

        describe('with multiple 401 status', () => {
            it('should not track if interval less than 2 seconds ', () => {
                let time = Date.now();
                parsedUrl.isSameTopDomain = true;
                client.get('url').subscribe();
                const req = controller.expectOne('url');
                req.flush({}, { status: 401, statusText: 'ERROR' });

                localStoreServiceMock.get.and.returnValue(time);
                spyOn(Date, 'now').and.returnValue(time + 1000);

                client.get('url2').subscribe();
                const req2 = controller.expectOne('url2');
                req2.flush({}, { status: 401, statusText: 'ERROR' });

                expect(trackingServiceMock.reportErrorObject).toHaveBeenCalledTimes(1);
            });

            it('should track if interval greater than 2 seconds ', () => {
                let time = Date.now();

                parsedUrl.isSameTopDomain = true;
                client.get('url').subscribe();
                const req = controller.expectOne('url');
                req.flush({}, { status: 401, statusText: 'ERROR' });

                localStoreServiceMock.get.and.returnValue(time);
                spyOn(Date, 'now').and.returnValue(time + 3000);

                client.get('url2').subscribe();
                const req2 = controller.expectOne('url2');
                req2.flush({}, { status: 401, statusText: 'ERROR' });

                expect(trackingServiceMock.reportErrorObject).toHaveBeenCalledTimes(2);
            });
        });

        describe('with status 401 and authenticated user', () => {
            beforeEach(() => {
                parsedUrl.isSameTopDomain = true;
            });

            it('should emit NativeAppEvent: "' + NativeEventType.LOGOUT + '"', () => {
                userServiceMock.isAuthenticated = true;

                client.get('url').subscribe();
                const req = controller.expectOne('url');
                req.flush({}, { status: 401, statusText: 'ERROR' });

                expect(nativeAppServiceMock.sendToNative).toHaveBeenCalledWith({
                    eventName: NativeEventType.LOGOUT,
                    parameters: {
                        systemLogout: true,
                    },
                });
            });
        });

        describe('with status 401 and native', () => {
            beforeEach(() => {
                parsedUrl.isSameTopDomain = true;
            });

            it('should still navigate if wrapper', () => {
                userServiceMock.isAuthenticated = true;
                nativeAppServiceMock.isNativeWrapper = true;
                client.get('url').subscribe();
                const req = controller.expectOne('url');
                req.flush({}, { status: 401, statusText: 'ERROR' });

                waitForAsync(() =>
                    expect(loginService2Mock.goTo).toHaveBeenCalledWith({
                        appendReferrer: true,
                        forceReload: true,
                        storeMessageQueue: true,
                    }),
                );
            });

            it('should not  navigate if other any native', () => {
                userServiceMock.isAuthenticated = true;
                nativeAppServiceMock.isNativeApp = true;
                client.get('url').subscribe();
                const req = controller.expectOne('url');
                req.flush({}, { status: 401, statusText: 'ERROR' });

                waitForAsync(() => expect(loginService2Mock.goTo).not.toHaveBeenCalled());
            });
        });
    });
});
