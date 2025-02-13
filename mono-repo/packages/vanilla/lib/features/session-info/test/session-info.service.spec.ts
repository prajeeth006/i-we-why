import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { AuthServiceMock } from '../../../core/test/auth/auth.mock';
import { LoggerMock } from '../../../core/test/languages/logger.mock';
import { NavigationServiceMock } from '../../../core/test/navigation/navigation.mock';
import { UserServiceMock } from '../../../core/test/user/user.mock';
import { SessionInfoService } from '../src/session-info.service';
import { SessionInfoConfigMock } from './session-info-config.mock';
import { SessionInfoOverlayServiceMock, SessionInfoResourceServiceMock } from './session-info.mock';

describe('SessionInfoService', () => {
    let service: SessionInfoService;
    let sessionInfoOverlayServiceMock: SessionInfoOverlayServiceMock;
    let authServiceMock: AuthServiceMock;
    let userServiceMock: UserServiceMock;
    let navigationServiceMock: NavigationServiceMock;
    let sessionInfoConfigMock: SessionInfoConfigMock;
    let logMock: LoggerMock;
    let sessionInfoResourceServiceMock: SessionInfoResourceServiceMock;
    const url = 'http://bwin.se/en/nativeapp/test';

    beforeEach(() => {
        sessionInfoOverlayServiceMock = MockContext.useMock(SessionInfoOverlayServiceMock);
        authServiceMock = MockContext.useMock(AuthServiceMock);
        userServiceMock = MockContext.useMock(UserServiceMock);
        navigationServiceMock = MockContext.useMock(NavigationServiceMock);
        sessionInfoConfigMock = MockContext.useMock(SessionInfoConfigMock);
        logMock = MockContext.useMock(LoggerMock);
        sessionInfoResourceServiceMock = MockContext.useMock(SessionInfoResourceServiceMock);

        TestBed.configureTestingModule({
            providers: [SessionInfoService, MockContext.providers],
        });
        sessionInfoConfigMock.urlBlacklist.push(url);
        service = TestBed.inject(SessionInfoService);
        sessionInfoConfigMock.whenReady.next();
    });

    function init(type: string, data: any) {
        service.processMessage(type, data);
        tick();

        expect(navigationServiceMock.location.absUrl).toHaveBeenCalled();
    }

    describe('checkStatus', () => {
        it('should show overlay', fakeAsync(() => {
            const data = { playerState: 'blockEd', balance: 25.6 };

            service.checkStatus();
            sessionInfoResourceServiceMock.rcpuStatus.resolve(data);
            tick();

            expect(sessionInfoOverlayServiceMock.show).toHaveBeenCalledWith(data);
        }));

        it('should not show overlay is user is not blocked', fakeAsync(() => {
            const data = { playerState: 'active', balance: 25.6 };

            service.checkStatus();
            sessionInfoResourceServiceMock.rcpuStatus.resolve(data);
            tick();

            expect(sessionInfoOverlayServiceMock.show).not.toHaveBeenCalled();
        }));

        it('should log warning if app call failed', fakeAsync(() => {
            service.checkStatus();
            sessionInfoResourceServiceMock.rcpuStatus.reject('');
            tick();

            expect(logMock.warn).toHaveBeenCalledWith('RCPU status api call failed.');
        }));
    });

    describe('processMessage', () => {
        it('should not open overlay on blacklisted pages', fakeAsync(() => {
            navigationServiceMock.location.absUrl.and.returnValue(url);
            const event = {
                name: 'RCPU_ACTION_ACK',
                data: null,
            };
            init(event.name, event.data);

            expect(logMock.error).toHaveBeenCalledWith(`${url} URL is blacklisted for event: ${JSON.stringify(event.name)}`);
        }));

        it('should not show overlay when RTMS message is missing payload property', fakeAsync(() => {
            const event = {
                name: 'RCPU_SESS_EXPIRY_EVENT',
                data: null,
            };
            init(event.name, event.data);

            expect(logMock.error).toHaveBeenCalledWith(`RTMS message missing required properties: ${JSON.stringify(event.name)}`);
        }));

        describe('RTMS message RCPU_SESS_EXPIRY_EVENT', () => {
            it('should show overlay when RTMS message is received', fakeAsync(() => {
                const event = {
                    name: 'RCPU_SESS_EXPIRY_EVENT',
                    data: { balance: '10.36', elapsedTime: '63200' },
                };
                init(event.name, event.data);

                expect(sessionInfoOverlayServiceMock.show).toHaveBeenCalledWith(event.data);
                expect(logMock.error).not.toHaveBeenCalled();
            }));
        });

        describe('RTMS message RCPU_ACTION_ACK', () => {
            it('should close overlay when rtms message with rcpuAction = CONTINUE', fakeAsync(() => {
                init('RCPU_ACTION_ACK', { rcpuAction: 'CONTINUE' });

                expect(sessionInfoOverlayServiceMock.close).toHaveBeenCalled();
            }));

            it('should logout user when RTMS message with rcpuAction = LOGOUT', fakeAsync(() => {
                userServiceMock.isAuthenticated = true;
                init('RCPU_ACTION_ACK', { rcpuAction: 'LOGOUT' });

                expect(sessionInfoOverlayServiceMock.close).toHaveBeenCalled();
                expect(authServiceMock.logout).toHaveBeenCalled();
            }));
        });
    });
});
