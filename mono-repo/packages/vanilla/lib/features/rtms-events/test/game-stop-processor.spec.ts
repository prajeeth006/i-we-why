import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { EventType, RtmsType } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { AuthServiceMock } from '../../../core/test/auth/auth.mock';
import { LoginService2Mock } from '../../../core/test/login/login-service.mock';
import { GameStopProcessor } from '../src/game-stop-proccessor';

describe('CashierEventsProcessor', () => {
    let service: GameStopProcessor;
    let authServiceMock: AuthServiceMock;
    let loginServiceMock: LoginService2Mock;

    beforeEach(() => {
        authServiceMock = MockContext.useMock(AuthServiceMock);
        loginServiceMock = MockContext.useMock(LoginService2Mock);

        TestBed.configureTestingModule({
            providers: [GameStopProcessor, MockContext.providers],
        });
    });

    beforeEach(() => {
        service = TestBed.inject(GameStopProcessor);
    });

    it('should process GAMSTOP_ACCOUNT_MATCH', fakeAsync(() => {
        service.process({ name: RtmsType.GAMSTOP_ACCOUNT_MATCH, type: EventType.Rtms, data: {} });

        expect(authServiceMock.logout).toHaveBeenCalledWith({ redirectAfterLogout: false, isAutoLogout: true });
        authServiceMock.logout.resolve();
        tick();
        expect(loginServiceMock.goTo).toHaveBeenCalledWith({ loginMessageKey: 'gamstop', forceReload: true });
    }));

    it('should process GAMPROTECT_ACCOUNT_MATCH', fakeAsync(() => {
        service.process({ name: RtmsType.GAMPROTECT_ACCOUNT_MATCH, type: EventType.Rtms, data: {} });

        expect(authServiceMock.logout).toHaveBeenCalledWith({ redirectAfterLogout: false, isAutoLogout: true });
        authServiceMock.logout.resolve();
        tick();
        expect(loginServiceMock.goTo).toHaveBeenCalledWith({ loginMessageKey: 'gamprotect', forceReload: true });
    }));
});
