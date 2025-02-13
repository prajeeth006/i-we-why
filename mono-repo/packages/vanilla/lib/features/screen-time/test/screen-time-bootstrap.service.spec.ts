import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { ON_LOGOUT_PROVIDER, UserLoginEvent } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { LogoutProvidersServiceMock } from '../../../core/test/auth/auth.mock';
import { UserServiceMock } from '../../../core/test/user/user.mock';
import { ScreenTimeBootstrapService } from '../src/screen-time-bootstrap.service';
import { ScreenTimeBrowserServiceMock, ScreenTimeConfigMock } from './screen-time.mock';

describe('ScreenTimeBootstrapService', () => {
    let service: ScreenTimeBootstrapService;
    let userServiceMock: UserServiceMock;
    let screenTimeConfigMock: ScreenTimeConfigMock;
    let screenTimeBrowserServiceMock: ScreenTimeBrowserServiceMock;
    let logoutProvidersServiceMock: LogoutProvidersServiceMock;

    beforeEach(() => {
        userServiceMock = MockContext.useMock(UserServiceMock);
        screenTimeConfigMock = MockContext.useMock(ScreenTimeConfigMock);
        screenTimeBrowserServiceMock = MockContext.useMock(ScreenTimeBrowserServiceMock);
        logoutProvidersServiceMock = MockContext.useMock(LogoutProvidersServiceMock);

        TestBed.configureTestingModule({
            providers: [ScreenTimeBootstrapService, MockContext.providers, { provide: ON_LOGOUT_PROVIDER, useValue: '' }],
        });

        service = TestBed.inject(ScreenTimeBootstrapService);
    });

    describe('OnFeatureInit', () => {
        it('should not init when unauthenticated', fakeAsync(() => {
            userServiceMock.isAuthenticated = false;
            service.onFeatureInit();
            screenTimeConfigMock.whenReady.next();
            tick();

            expect(screenTimeBrowserServiceMock.init).not.toHaveBeenCalled();
            expect(logoutProvidersServiceMock.registerProviders).toHaveBeenCalled();
        }));

        it('should init when authenticated', fakeAsync(() => {
            service.onFeatureInit();
            screenTimeConfigMock.whenReady.next();
            tick();

            expect(screenTimeBrowserServiceMock.init).toHaveBeenCalled();
        }));

        it('should init on UserLoginEvent', fakeAsync(() => {
            userServiceMock.isAuthenticated = false;
            service.onFeatureInit();
            screenTimeConfigMock.whenReady.next();
            tick();
            userServiceMock.triggerEvent(new UserLoginEvent());

            expect(screenTimeBrowserServiceMock.init).toHaveBeenCalled();
        }));
    });
});
