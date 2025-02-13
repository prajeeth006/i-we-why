import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { CookieName } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { SharedFeaturesApiServiceMock } from '../../../core/src/http/test/shared-features-api.mock';
import { CookieServiceMock } from '../../../core/test/browser/cookie.mock';
import { DslServiceMock } from '../../../core/test/dsl/dsl.mock';
import { UserServiceMock } from '../../../core/test/user/user.mock';
import { ACCEPTED_STATUS } from '../src/player-gaming-declaration-constants';
import { GamingDeclaration, PlayerGamingDeclarationService } from '../src/player-gaming-declaration.service';
import { PlayerGamingDeclarationConfigMock } from './player-gaming-declaration.client-config.mock';

describe('PlayerGamingDeclarationService', () => {
    let service: PlayerGamingDeclarationService;
    let apiServiceMock: SharedFeaturesApiServiceMock;
    let userServiceMock: UserServiceMock;
    let cookieServiceMock: CookieServiceMock;
    let playerGamingDeclarationConfig: PlayerGamingDeclarationConfigMock;
    let dslServiceMock: DslServiceMock;

    const gamingDeclaration: GamingDeclaration = { status: 'N', acceptedDate: new Date() };

    beforeEach(() => {
        apiServiceMock = MockContext.useMock(SharedFeaturesApiServiceMock);
        userServiceMock = MockContext.useMock(UserServiceMock);
        cookieServiceMock = MockContext.useMock(CookieServiceMock);
        playerGamingDeclarationConfig = MockContext.useMock(PlayerGamingDeclarationConfigMock);
        dslServiceMock = MockContext.useMock(DslServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, PlayerGamingDeclarationService],
        });

        service = TestBed.inject(PlayerGamingDeclarationService);
        userServiceMock.isAuthenticated = true;
    });

    describe('load', () => {
        it('should return value if loaded', () => {
            const spy = jasmine.createSpy();

            service.gamingDeclaration.subscribe(spy);
            service.load();

            apiServiceMock.get.completeWith(gamingDeclaration);

            expect(spy).toHaveBeenCalledWith(gamingDeclaration);
            expect(apiServiceMock.get).toHaveBeenCalledWith('gamingdeclaration');
        });
        it('should not call service if not authenticated', () => {
            userServiceMock.isAuthenticated = false;

            service.load();

            expect(apiServiceMock.get).not.toHaveBeenCalled();
        });
    });

    describe('accept', () => {
        it('should call the post method of the shared api', () => {
            service.accept({ status: 'Y' });
            expect(apiServiceMock.post).toHaveBeenCalledWith('gamingdeclaration/accept', { status: 'Y' });
        });
    });

    describe('setCookie', () => {
        it('should set gdAccepted cookie', () => {
            service.setCookie();
            expect(cookieServiceMock.put).toHaveBeenCalledWith(CookieName.GdAccepted, ACCEPTED_STATUS);
        });
    });

    describe('removeCookie', () => {
        it('should remove gdAccepted cookie', () => {
            service.removeCookie();
            expect(cookieServiceMock.remove).toHaveBeenCalledWith(CookieName.GdAccepted);
        });
    });

    describe('isAccepted', () => {
        it('should return acceptance status from cookie', () => {
            cookieServiceMock.get.and.returnValue('Y');
            const result = service.isAccepted();
            expect(cookieServiceMock.get).toHaveBeenCalledWith(CookieName.GdAccepted);
            expect(result).toBeTrue();
        });
    });

    describe('isEnabled', () => {
        it('should evaluate expression with configured condition', fakeAsync(() => {
            playerGamingDeclarationConfig.isEnabledCondition = 'TRUE';
            service.isEnabled();

            playerGamingDeclarationConfig.whenReady.next();
            tick();

            expect(dslServiceMock.evaluateExpression).toHaveBeenCalledWith('TRUE');
        }));
    });
});
