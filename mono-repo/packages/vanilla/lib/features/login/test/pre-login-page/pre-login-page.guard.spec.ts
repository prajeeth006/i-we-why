import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot } from '@angular/router';

import { MockContext } from 'moxxi';

import { DeviceServiceMock } from '../../../../core/test/browser/device.mock';
import { NavigationServiceMock } from '../../../../core/test/navigation/navigation.mock';
import { UserServiceMock } from '../../../../core/test/user/user.mock';
import { preLoginPageGuard } from '../../src/pre-login-page/pre-login-page.guard';

describe('PreLoginPageGuard', () => {
    let userServiceMock: UserServiceMock;
    let navigationServiceMock: NavigationServiceMock;
    let deviceServiceMock: DeviceServiceMock;

    beforeEach(() => {
        userServiceMock = MockContext.useMock(UserServiceMock);
        navigationServiceMock = MockContext.useMock(NavigationServiceMock);
        deviceServiceMock = MockContext.useMock(DeviceServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers],
        });
    });

    function runGuard(route: ActivatedRouteSnapshot) {
        return TestBed.runInInjectionContext(() => {
            return preLoginPageGuard(route);
        });
    }

    describe('canActivate', () => {
        it('should throw', () => {
            try {
                runGuard(<any>{ queryParams: {} });
            } catch (ex) {
                expect(ex.message).toBe('url and origin must be provided in order to access this page');
            }
        });

        it('should be enabled if user is not authenticated', () => {
            userServiceMock.isAuthenticated = false;
            deviceServiceMock.isMobilePhone = true;
            const enabled = runGuard(<any>{ queryParams: { url: 'https://www.bwin.com', origin: 'Betslip' } });

            expect(enabled).toBeTrue();
        });

        it('should redirect if user is authenticated', () => {
            userServiceMock.isAuthenticated = true;
            const enabled = runGuard(<any>{ queryParams: { url: 'https://www.bwin.com', origin: 'Betslip' } });

            expect(enabled).toBeFalse();
            expect(navigationServiceMock.goTo).toHaveBeenCalledWith('https://www.bwin.com');
        });

        it('should redirect if user is not authenticated and on desktop', () => {
            userServiceMock.isAuthenticated = false;
            deviceServiceMock.isMobilePhone = false;
            const enabled = runGuard(<any>{ queryParams: { url: 'https://www.bwin.com', origin: 'Betslip' } });

            expect(enabled).toBeFalse();
            expect(navigationServiceMock.goTo).toHaveBeenCalledWith('https://www.bwin.com');
        });
    });
});
