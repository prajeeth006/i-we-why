import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { AuthServiceMock } from '../../../../core/test/auth/auth.mock';
import { DslServiceMock } from '../../../../core/test/dsl/dsl.mock';
import { LoginNavigationServiceMock } from '../../../../core/test/login/navigation-service.mocks';
import { NavigationServiceMock } from '../../../../core/test/navigation/navigation.mock';
import { UserServiceMock } from '../../../../core/test/user/user.mock';
import { LoginIntegrationType } from '../../src/integration/login-integration.client-config';
import { LoginIntegrationService } from '../../src/integration/login-integration.service';
import { DanskeSpilLoginServiceMock, LoginIntegrationConfigMock, LoginServiceMock } from '../login.mocks';

describe('LoginIntegrationService', () => {
    let service: LoginIntegrationService;
    let loginIntegrationConfigMock: LoginIntegrationConfigMock;
    let loginServiceMock: LoginServiceMock;
    let authServiceMock: AuthServiceMock;
    let userServiceMock: UserServiceMock;
    let dslServiceMock: DslServiceMock;
    let danskeSpilLoginServiceMock: DanskeSpilLoginServiceMock;
    let navigationServiceMock: NavigationServiceMock;
    let loginNavigationServiceMock: LoginNavigationServiceMock;
    let spy: jasmine.Spy;

    beforeEach(() => {
        loginIntegrationConfigMock = MockContext.useMock(LoginIntegrationConfigMock);
        loginServiceMock = MockContext.useMock(LoginServiceMock);
        authServiceMock = MockContext.useMock(AuthServiceMock);
        userServiceMock = MockContext.useMock(UserServiceMock);
        dslServiceMock = MockContext.useMock(DslServiceMock);
        danskeSpilLoginServiceMock = MockContext.useMock(DanskeSpilLoginServiceMock);
        navigationServiceMock = MockContext.useMock(NavigationServiceMock);
        loginNavigationServiceMock = MockContext.useMock(LoginNavigationServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, LoginIntegrationService],
        });

        service = TestBed.inject(LoginIntegrationService);

        loginIntegrationConfigMock.options = { version: 1, redirectAfterLogin: 'FALSE', standaloneLoginUrl: 'https://foo.bar' };
    });

    describe('init()', () => {
        it('should not do anything', fakeAsync(() => {
            loginIntegrationConfigMock.type = LoginIntegrationType.None;

            service.init();
            loginIntegrationConfigMock.whenReady.next();
            tick();

            expect(danskeSpilLoginServiceMock.isSessionActive).not.toHaveBeenCalled();
        }));

        it('should login', fakeAsync(() => {
            loginIntegrationConfigMock.type = LoginIntegrationType.DanskeSpilDk;
            userServiceMock.isAuthenticated = false;
            service.init();
            loginIntegrationConfigMock.whenReady.next();
            tick();

            danskeSpilLoginServiceMock.isSessionActive.completeWith(true);
            danskeSpilLoginServiceMock.getLoginParameters.completeWith({ username: 'user', password: 'pass' });
            dslServiceMock.evaluateExpression.completeWith(false);
            expect(loginServiceMock.autoLogin).toHaveBeenCalledWith({ username: 'user', password: 'pass' }, false);
        }));

        it('should logout', fakeAsync(() => {
            loginIntegrationConfigMock.type = LoginIntegrationType.DanskeSpilDk;
            userServiceMock.isAuthenticated = true;
            service.init();
            loginIntegrationConfigMock.whenReady.next();
            tick();

            danskeSpilLoginServiceMock.isSessionActive.completeWith(false);
            expect(authServiceMock.logout).toHaveBeenCalled();
        }));
    });

    it('should not be enabled', () => {
        expect(service.redirectEnabled).toBeFalse();
    });

    it('should be enabled', () => {
        loginIntegrationConfigMock.options.version = 2;
        loginIntegrationConfigMock.type = LoginIntegrationType.DanskeSpilDk;

        expect(service.redirectEnabled).toBeTrue();
    });

    it('should go to', () => {
        service.redirectToLogin();

        expect(loginNavigationServiceMock.storeReturnUrl).toHaveBeenCalled();
        expect(navigationServiceMock.goTo).toHaveBeenCalledWith('https://foo.bar');
    });

    describe('logout()', () => {
        beforeEach(() => {
            spy = jasmine.createSpy();
        });

        it('should not do anything', fakeAsync(() => {
            loginIntegrationConfigMock.type = LoginIntegrationType.None;

            service.logout().then(spy);
            loginIntegrationConfigMock.whenReady.next();
            tick();

            expect(danskeSpilLoginServiceMock.logout).not.toHaveBeenCalled();
            expect(spy).toHaveBeenCalledWith(true);
        }));

        it('should invoke danskespil logout', fakeAsync(() => {
            loginIntegrationConfigMock.type = LoginIntegrationType.DanskeSpilDk;

            service.logout().then(spy);
            loginIntegrationConfigMock.whenReady.next();
            tick();

            danskeSpilLoginServiceMock.logout.resolve({});
            tick();

            expect(danskeSpilLoginServiceMock.logout).toHaveBeenCalled();
            expect(spy).toHaveBeenCalledWith({});
        }));
    });
});
