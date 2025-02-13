import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterStateSnapshot, RoutesRecognized } from '@angular/router';

import { MockContext } from 'moxxi';

import { NativeAppServiceMock } from '../../../core/test/native-app/native-app.mock';
import { NavigationServiceMock } from '../../../core/test/navigation/navigation.mock';
import { RouterMock } from '../../../core/test/router.mock';
import { UserServiceMock } from '../../../core/test/user/user.mock';
import { PlayerGamingDeclarationBootstrapService } from '../src/player-gaming-declaration-bootstrap.service';
import { GAMING_DECLARATION_PATH } from '../src/player-gaming-declaration-constants';
import { PlayerGamingDeclarationServiceMock } from './player-gaming-declaration.mocks';

describe('PlayerGamingDeclarationBootstrapService', () => {
    let service: PlayerGamingDeclarationBootstrapService;
    let userServiceMock: UserServiceMock;
    let gamingDeclarationService: PlayerGamingDeclarationServiceMock;
    let navigationServiceMock: NavigationServiceMock;
    let nativeAppMock: NativeAppServiceMock;
    let routerMock: RouterMock;

    beforeEach(() => {
        userServiceMock = MockContext.useMock(UserServiceMock);
        gamingDeclarationService = MockContext.useMock(PlayerGamingDeclarationServiceMock);
        navigationServiceMock = MockContext.useMock(NavigationServiceMock);
        nativeAppMock = MockContext.useMock(NativeAppServiceMock);
        routerMock = MockContext.useMock(RouterMock);

        TestBed.configureTestingModule({
            providers: [PlayerGamingDeclarationBootstrapService, MockContext.providers],
        });

        userServiceMock.isAuthenticated = true;
        gamingDeclarationService.isEnabled.and.returnValue(Promise.resolve(true));

        service = TestBed.inject(PlayerGamingDeclarationBootstrapService);
    });

    describe('OnFeatureInit', () => {
        it('should not call service if first login', () => {
            userServiceMock.isFirstLogin = true;
            service.onFeatureInit();

            expect(gamingDeclarationService.load).not.toHaveBeenCalled();
            expect(navigationServiceMock.goTo).not.toHaveBeenCalled();
        });

        it('should not call service if already accepted read from user claim', () => {
            userServiceMock.gamingDeclarationFlag = 'Y';
            service.onFeatureInit();

            expect(gamingDeclarationService.load).not.toHaveBeenCalled();
            expect(navigationServiceMock.goTo).not.toHaveBeenCalled();
        });

        it('should not call service if already accepted read from cookie', () => {
            gamingDeclarationService.isAccepted.and.returnValue(true);
            service.onFeatureInit();

            expect(gamingDeclarationService.load).not.toHaveBeenCalled();
            expect(navigationServiceMock.goTo).not.toHaveBeenCalled();
        });

        it('should call service if not accepted', fakeAsync(() => {
            userServiceMock.gamingDeclarationFlag = 'N';
            service.onFeatureInit();
            gamingDeclarationService.gamingDeclaration.next({ status: 'N', acceptedDate: new Date() });
            tick();

            expect(navigationServiceMock.goTo).toHaveBeenCalledWith(GAMING_DECLARATION_PATH);
            expect(gamingDeclarationService.load).toHaveBeenCalled();
        }));

        it('should remove Cookie if not applicable', fakeAsync(() => {
            service.onFeatureInit();
            gamingDeclarationService.gamingDeclaration.next({ status: 'NA', acceptedDate: new Date() });
            tick();

            expect(navigationServiceMock.goTo).not.toHaveBeenCalledWith();
            expect(gamingDeclarationService.removeCookie).toHaveBeenCalledWith();
            expect(gamingDeclarationService.load).toHaveBeenCalled();
        }));

        it('should send hideCloseButton event on route recognized', fakeAsync(() => {
            service.onFeatureInit();
            tick();

            const createRouterStateSnapshot = function () {
                const routerStateSnapshot = jasmine.createSpyObj('RouterStateSnapshot', ['']);
                routerStateSnapshot.root = jasmine.createSpyObj('root', ['firstChild']);
                routerStateSnapshot.root.firstChild.data = {
                    xxx: false,
                };

                return <RouterStateSnapshot>routerStateSnapshot;
            };

            routerMock.events.next(new RoutesRecognized(1, 'gaming-declaration', '', createRouterStateSnapshot()));

            expect(nativeAppMock.sendToNative).toHaveBeenCalledWith({ eventName: 'hideCloseButton' });
        }));
    });
});
