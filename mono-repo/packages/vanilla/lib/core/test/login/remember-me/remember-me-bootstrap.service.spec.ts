import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { WINDOW } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { WindowMock } from '../../../src/browser/window/test/window-ref.mock';
import { RememberMeBootstrapService } from '../../../src/login/remember-me-bootstrap.service';
import { LoggerMock } from '../../languages/logger.mock';
import { UserServiceMock } from '../../user/user.mock';
import { RememberMeLoginServiceMock, RememberMeServiceMock } from './remember-me.service.mock';

describe('RememberMeBootstrapService', () => {
    let target: RememberMeBootstrapService;
    let rememberMeServiceMock: RememberMeServiceMock;
    let rememberMeLoginServiceMock: RememberMeLoginServiceMock;
    let userMock: UserServiceMock;
    let windowMock: WindowMock;
    let log: LoggerMock;
    let spy: jasmine.Spy;

    beforeEach(() => {
        rememberMeServiceMock = MockContext.useMock(RememberMeServiceMock);
        rememberMeLoginServiceMock = MockContext.useMock(RememberMeLoginServiceMock);
        userMock = MockContext.useMock(UserServiceMock);
        windowMock = new WindowMock();
        log = MockContext.useMock(LoggerMock);

        TestBed.configureTestingModule({
            providers: [
                RememberMeBootstrapService,
                MockContext.providers,
                {
                    provide: WINDOW,
                    useValue: windowMock,
                },
            ],
        });

        rememberMeServiceMock.tokenExists.and.returnValue(true);
        userMock.isAuthenticated = false;
        spy = jasmine.createSpy();

        target = TestBed.inject(RememberMeBootstrapService);
    });

    afterEach(() => {
        expect(rememberMeServiceMock.login).not.toHaveBeenCalled();
    });

    describe('onAppInit()', () => {
        it('should login on app start', fakeAsync(() => {
            target.onAppInit().then(spy); // act 1

            expect(rememberMeLoginServiceMock.loginWithToken).toHaveBeenCalled();
            expect(spy).not.toHaveBeenCalled();

            rememberMeLoginServiceMock.loginWithToken.completeWith(); // act 2
            tick();

            expect(spy).toHaveBeenCalled();
        }));

        shouldNotLoginIf('user already logged-in', () => (userMock.isAuthenticated = true));
        shouldNotLoginIf('remember-me token not exist', () => rememberMeServiceMock.tokenExists.and.returnValue(false));

        function shouldNotLoginIf(conditionDesc: string, setup: Function) {
            it(
                'should not login if ' + conditionDesc,
                fakeAsync(() => {
                    setup();

                    target.onAppInit().then(spy); // act 1

                    expect(rememberMeLoginServiceMock.loginWithToken).not.toHaveBeenCalled();

                    tick(); // act 2

                    expect(spy).toHaveBeenCalled();
                }),
            );
        }

        it('should log error if login failed', fakeAsync(() => {
            target.onAppInit().then(spy);

            rememberMeLoginServiceMock.loginWithToken.error('loginError'); // act
            tick();

            expect(spy).toHaveBeenCalled();
            expect(log.errorRemote).toHaveBeenCalledWith(
                'RememberMe: Failed to login with token on app start. User is left unauthenticated.',
                'loginError',
            );
        }));

        it('should reload page if not user authenticated and auth token exists', () => {
            userMock.isAuthenticated = false;
            rememberMeServiceMock.authTokenExists.and.returnValue(true);
            target.onAppInit();

            expect(windowMock.location.reload).toHaveBeenCalled();
            expect(rememberMeLoginServiceMock.loginWithToken).not.toHaveBeenCalled();
        });

        it('should reload page if not user authenticated and last call is too recent', () => {
            userMock.isAuthenticated = false;
            rememberMeLoginServiceMock.lastCallTooRecent.and.returnValue(true);
            target.onAppInit();

            expect(windowMock.location.reload).toHaveBeenCalled();
            expect(rememberMeLoginServiceMock.loginWithToken).not.toHaveBeenCalled();
        });
    });
});
