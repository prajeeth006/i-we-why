import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { UserServiceMock } from '../../../core/test/user/user.mock';
import { playerGamingDeclarationCanActivateGuard, playerGamingDeclarationCanDeactivateGuard } from '../src/player-gaming-declaration.guard';
import { PlayerGamingDeclarationServiceMock } from './player-gaming-declaration.mocks';

describe('PlayerGamingDeclarationGuard', () => {
    let userServiceMock: UserServiceMock;
    let gamingDeclarationService: PlayerGamingDeclarationServiceMock;
    let spy: jasmine.Spy;

    beforeEach(() => {
        userServiceMock = MockContext.useMock(UserServiceMock);
        gamingDeclarationService = MockContext.useMock(PlayerGamingDeclarationServiceMock);
        spy = jasmine.createSpy();

        TestBed.configureTestingModule({
            providers: [MockContext.providers],
        });

        userServiceMock.isAuthenticated = true;
        userServiceMock.gamingDeclarationFlag = 'N';
        gamingDeclarationService.isAccepted.and.returnValue(false);
        gamingDeclarationService.isEnabled.and.returnValue(Promise.resolve(true));
    });

    function runCanActivateGuard() {
        return TestBed.runInInjectionContext(() => {
            return playerGamingDeclarationCanActivateGuard();
        });
    }

    function runCanDeactivateGuard() {
        return TestBed.runInInjectionContext(() => {
            return playerGamingDeclarationCanDeactivateGuard();
        });
    }

    describe('canActivate', () => {
        it('should return true', fakeAsync(() => {
            runCanActivateGuard().then(spy);
            tick();
            expect(spy).toHaveBeenCalledWith(true);
        }));

        it('should return false if user not authenticated', fakeAsync(() => {
            userServiceMock.isAuthenticated = false;

            runCanActivateGuard().then(spy);
            tick();
            expect(spy).toHaveBeenCalledWith(false);
        }));

        it('should return false if gamingDeclarationFlag equals Y', fakeAsync(() => {
            userServiceMock.gamingDeclarationFlag = 'Y';
            gamingDeclarationService.isAccepted.and.returnValue(false);

            runCanActivateGuard().then(spy);
            tick();
            expect(spy).toHaveBeenCalledWith(false);
        }));

        it('should return false if cookie isAccepted is true', fakeAsync(() => {
            gamingDeclarationService.isAccepted.and.returnValue(true);

            runCanActivateGuard().then(spy);
            tick();
            expect(spy).toHaveBeenCalledWith(false);
        }));
    });

    describe('canDeactivate', () => {
        it('should return true if user gamingDeclarationFlag accepted', fakeAsync(() => {
            userServiceMock.gamingDeclarationFlag = 'Y';

            runCanDeactivateGuard().then(spy);
            tick();
            expect(spy).toHaveBeenCalledWith(true);
        }));

        it('should return true if cookie accepted is true', fakeAsync(() => {
            gamingDeclarationService.isAccepted.and.returnValue(true);

            runCanDeactivateGuard().then(spy);
            tick();
            expect(spy).toHaveBeenCalledWith(true);
        }));

        it('should return false', fakeAsync(() => {
            runCanDeactivateGuard().then(spy);
            tick();
            expect(spy).toHaveBeenCalledWith(false);
        }));
    });
});
