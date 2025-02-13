import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { NativeEventType } from '../../../core/src/native-app/native-app.models';
import { NativeAppConfigMock, NativeAppServiceMock } from '../../../core/test/native-app/native-app.mock';
import { WrapperSettingsServiceMock } from '../../../shared/native-app/test/wrapper-settings.mock';
import { loginStandaloneGuard } from '../src/login-standalone.guard';
import { LoginConfigMock, LoginContentMock, LoginContentServiceMock, LoginIntegrationServiceMock } from './login.mocks';

describe('LoginStandaloneGuard', () => {
    let loginIntegrationServiceMock: LoginIntegrationServiceMock;
    let loginConfigMock: LoginConfigMock;
    let loginContentMock: LoginContentMock;
    let wrapperSettingsServiceMock: WrapperSettingsServiceMock;
    let nativeAppConfigMock: NativeAppConfigMock;
    let nativeAppServiceMock: NativeAppServiceMock;
    let loginContentServiceMock: LoginContentServiceMock;
    let spy: jasmine.Spy;

    beforeEach(() => {
        loginIntegrationServiceMock = MockContext.useMock(LoginIntegrationServiceMock);
        loginConfigMock = MockContext.useMock(LoginConfigMock);
        loginContentMock = MockContext.useMock(LoginContentMock);
        wrapperSettingsServiceMock = MockContext.useMock(WrapperSettingsServiceMock);
        nativeAppConfigMock = MockContext.useMock(NativeAppConfigMock);
        nativeAppServiceMock = MockContext.useMock(NativeAppServiceMock);
        loginContentServiceMock = MockContext.useMock(LoginContentServiceMock);
        spy = jasmine.createSpy();

        TestBed.configureTestingModule({
            providers: [MockContext.providers],
        });
    });

    function runGuard() {
        return TestBed.runInInjectionContext(() => {
            return loginStandaloneGuard();
        });
    }

    it('should activate', fakeAsync(() => {
        runGuard().then(spy);
        loginConfigMock.whenReady.next();
        loginContentMock.whenReady.next();
        loginContentServiceMock.initialized.next();
        loginIntegrationServiceMock.init.resolve();
        wrapperSettingsServiceMock.applicationSettingsFired.next(true);
        tick();

        expect(spy).toHaveBeenCalledWith(true);
        expect(loginIntegrationServiceMock.redirectToLogin).not.toHaveBeenCalled();
    }));

    it('should redirect and not activate for danske and version 2', fakeAsync(() => {
        loginIntegrationServiceMock.redirectEnabled = true;
        runGuard().then(spy);
        loginConfigMock.whenReady.next();
        loginContentMock.whenReady.next();
        loginContentServiceMock.initialized.next();
        loginIntegrationServiceMock.init.resolve();
        wrapperSettingsServiceMock.applicationSettingsFired.next(true);
        tick();

        expect(spy).toHaveBeenCalledWith(false);
        expect(loginIntegrationServiceMock.redirectToLogin).toHaveBeenCalled();
    }));

    it('should send event and not activate', fakeAsync(() => {
        nativeAppConfigMock.sendOpenLoginDialogEvent = true;
        runGuard().then(spy);
        tick();

        expect(spy).toHaveBeenCalledWith(false);
        expect(nativeAppServiceMock.sendToNative).toHaveBeenCalledWith({ eventName: NativeEventType.OPENLOGINDIALOG });
    }));
});
