import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { LOGIN_RESPONSE_HANDLER_HOOK } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { UserServiceMock } from '../../../core/test/user/user.mock';
import { UserSummaryCookieServiceMock } from '../../../shared/user-summary/test/user-summary.service.mock';
import { LoginResponseHandlerHookMock, LoginResponseHandlerServiceMock } from '../../login/test/login.mocks';
import { UserSummaryBootstrapService } from '../src/user-summary-bootstrap.service';
import { UserSummaryOverlayServiceMock } from './user-summary-overlay.service.mock';
import { UserSummaryConfigMock } from './user-summary.client-config.mock';

describe('UserSummaryBootstrapService', () => {
    let service: UserSummaryBootstrapService;
    let userServiceMock: UserServiceMock;
    let userSummaryConfigMock: UserSummaryConfigMock;
    let userSummaryOverlayServiceMock: UserSummaryOverlayServiceMock;
    let userSummaryCookieServiceMock: UserSummaryCookieServiceMock;
    let loginResponseHandlerServiceMock: LoginResponseHandlerServiceMock;
    let hookMock: LoginResponseHandlerHookMock;

    beforeEach(() => {
        userServiceMock = MockContext.useMock(UserServiceMock);
        userSummaryConfigMock = MockContext.useMock(UserSummaryConfigMock);
        userSummaryOverlayServiceMock = MockContext.useMock(UserSummaryOverlayServiceMock);
        userSummaryCookieServiceMock = MockContext.useMock(UserSummaryCookieServiceMock);
        loginResponseHandlerServiceMock = MockContext.useMock(LoginResponseHandlerServiceMock);
        hookMock = MockContext.createMock(LoginResponseHandlerHookMock);

        TestBed.configureTestingModule({
            providers: [
                UserSummaryBootstrapService,
                MockContext.providers,
                { provide: LOGIN_RESPONSE_HANDLER_HOOK, useValue: hookMock, multi: true },
            ],
        });

        service = TestBed.inject(UserSummaryBootstrapService);
    });

    describe('onFeatureInit', () => {
        it('should not init if not real player', fakeAsync(() => {
            userServiceMock.isAuthenticated = true;
            userServiceMock.realPlayer = false;
            userSummaryCookieServiceMock.read.and.returnValue('1');

            service.onFeatureInit();
            userSummaryConfigMock.whenReady.next();
            tick();

            expect(userSummaryOverlayServiceMock.init).not.toHaveBeenCalled();
        }));

        it('should not init if no cookie', fakeAsync(() => {
            userServiceMock.isAuthenticated = true;
            userServiceMock.realPlayer = true;

            service.onFeatureInit();
            userSummaryConfigMock.whenReady.next();
            tick();

            expect(userSummaryOverlayServiceMock.init).not.toHaveBeenCalled();
        }));

        it('should init if enabled', fakeAsync(() => {
            userServiceMock.isAuthenticated = true;
            userServiceMock.realPlayer = true;
            userSummaryCookieServiceMock.read.and.returnValue('1');

            service.onFeatureInit();
            userSummaryConfigMock.whenReady.next();
            tick();

            expect(loginResponseHandlerServiceMock.registerHooks).toHaveBeenCalledWith([hookMock]);
            expect(userSummaryOverlayServiceMock.init).toHaveBeenCalled();
        }));
    });
});
