import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { NativeEventType, RememberMeLoginService } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';
import { throwError } from 'rxjs';

import { DeviceFingerprintServiceMock } from '../../../../features/login/test/device-fingerprint.mock';
import { LoginResponseHandlerServiceMock } from '../../../../features/login/test/login.mocks';
import { AppInfoConfigMock } from '../../../src/client-config/test/app-info-config.mock';
import { LocalStoreServiceMock } from '../../browser/local-store.mock';
import { LoggerMock } from '../../languages/logger.mock';
import { NativeAppServiceMock } from '../../native-app/native-app.mock';
import { RememberMeServiceMock } from './remember-me.service.mock';

describe('RememberMeLoginService', () => {
    let target: RememberMeLoginService;
    let rememberMeServiceMock: RememberMeServiceMock;
    let nativeAppServiceMock: NativeAppServiceMock;
    let loginResponseHandlerServiceMock: LoginResponseHandlerServiceMock;
    let localStorage: LocalStoreServiceMock;
    let spy: jasmine.Spy;

    beforeEach(() => {
        rememberMeServiceMock = MockContext.useMock(RememberMeServiceMock);
        nativeAppServiceMock = MockContext.useMock(NativeAppServiceMock);
        loginResponseHandlerServiceMock = MockContext.useMock(LoginResponseHandlerServiceMock);
        localStorage = MockContext.useMock(LocalStoreServiceMock);
        MockContext.useMock(DeviceFingerprintServiceMock);
        MockContext.useMock(AppInfoConfigMock);
        MockContext.useMock(LoggerMock);

        TestBed.configureTestingModule({
            providers: [RememberMeLoginService, MockContext.providers],
        });
        spy = jasmine.createSpy();
        target = TestBed.inject(RememberMeLoginService);
    });

    describe('loginWithToken()', () => {
        it('should catch error when login failed', fakeAsync(() => {
            rememberMeServiceMock.login.and.returnValue(throwError(() => new Error('error login')));
            target.loginWithToken().subscribe({
                error: () => spy,
            });

            expect(rememberMeServiceMock.login).toHaveBeenCalled();
            tick();

            expect(nativeAppServiceMock.sendToNative).toHaveBeenCalledWith({ eventName: NativeEventType.REMEMBER_ME_LOGIN_FAILED });
        }));

        it('should catch error when login response handle failed', fakeAsync(() => {
            target.loginWithToken().subscribe({
                error: () => spy,
            });

            expect(rememberMeServiceMock.login).toHaveBeenCalled();

            rememberMeServiceMock.login.next();
            loginResponseHandlerServiceMock.handle.reject();

            tick();

            expect(nativeAppServiceMock.sendToNative).toHaveBeenCalledWith({ eventName: NativeEventType.REMEMBER_ME_LOGIN_FAILED });
        }));

        it('should call api only when last call was more than 5s earlier', fakeAsync(() => {
            localStorage.get.and.returnValue(Date.now());

            target.loginWithToken().subscribe({
                error: () => spy,
            });
            expect(rememberMeServiceMock.login).not.toHaveBeenCalled();

            localStorage.get.and.returnValue(Date.now() - 6000);
            target.loginWithToken().subscribe({
                error: () => spy,
            });
            expect(rememberMeServiceMock.login).toHaveBeenCalled();
        }));
    });
});
