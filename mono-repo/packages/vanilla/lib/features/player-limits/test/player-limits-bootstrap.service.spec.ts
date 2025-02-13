import { TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { PlayerLimitsServiceMock } from '../../../shared/limits/test/player-limits.service.mock';
import { LoginServiceMock } from '../../../shared/login/test/login.service.mock';
import { PlayerLimitsBootstrapService } from '../src/player-limits-bootstrap.service';

describe('PlayerLimitsBootstrapService', () => {
    let service: PlayerLimitsBootstrapService;
    let playerLimitsServiceMock: PlayerLimitsServiceMock;
    let loginServiceMock: LoginServiceMock;

    beforeEach(() => {
        playerLimitsServiceMock = MockContext.useMock(PlayerLimitsServiceMock);
        loginServiceMock = MockContext.useMock(LoginServiceMock);

        TestBed.configureTestingModule({
            providers: [PlayerLimitsBootstrapService, MockContext.providers],
        });

        service = TestBed.inject(PlayerLimitsBootstrapService);
    });

    describe('onFeatureInit', () => {
        it('should refresh player limits on runAfterLogin', () => {
            loginServiceMock.runAfterLogin.and.callFake((_, callback) => callback());

            service.onFeatureInit();

            expect(loginServiceMock.runAfterLogin).toHaveBeenCalledOnceWith(PlayerLimitsBootstrapService.name, jasmine.any(Function));
            expect(playerLimitsServiceMock.refresh).toHaveBeenCalledTimes(1);
        });
    });
});
