import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { ClaimsConfig } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';
import { of } from 'rxjs';

import { ActivatedRouteMock } from '../../../core/test/activated-route.mock';
import { HtmlNodeMock } from '../../../core/test/browser/html-node.mock';
import { ClientConfigServiceMock } from '../../../core/test/client-config/client-config.mock';
import { DslServiceMock } from '../../../core/test/dsl/dsl.mock';
import { NativeAppServiceMock } from '../../../core/test/native-app/native-app.mock';
import { NavigationServiceMock } from '../../../core/test/navigation/navigation.mock';
import { RouteDataServiceMock } from '../../../core/test/routing/route-data.mock';
import { UserServiceMock } from '../../../core/test/user/user.mock';
import { FakeTrustAsHtmlPipe } from '../../rtms-overlay/test/components/rtms-overlay-component-base.spec';
import { PlayerGamingDeclarationComponent } from '../src/player-gaming-declaration.component';
import { PlayerGamingDeclarationServiceMock, PlayerGamingDeclarationTrackingServiceMock } from './player-gaming-declaration.mocks';

describe('PlayerGamingDeclarationComponent', () => {
    let fixture: ComponentFixture<PlayerGamingDeclarationComponent>;
    let component: PlayerGamingDeclarationComponent;
    let navigationServiceMock: NavigationServiceMock;
    let routeDataServiceMock: RouteDataServiceMock;
    let gamingDeclarationServiceMock: PlayerGamingDeclarationServiceMock;
    let clientConfigServiceMock: ClientConfigServiceMock;
    let userServiceMock: UserServiceMock;
    let activatedRouteMock: ActivatedRouteMock;
    let playerGamingDeclarationTrackingServiceMock: PlayerGamingDeclarationTrackingServiceMock;
    let nativeAppServiceMock: NativeAppServiceMock;
    let htmlNodeMock: HtmlNodeMock;
    let dslServiceMock: DslServiceMock;

    beforeEach(() => {
        navigationServiceMock = MockContext.useMock(NavigationServiceMock);
        routeDataServiceMock = MockContext.useMock(RouteDataServiceMock);
        gamingDeclarationServiceMock = MockContext.useMock(PlayerGamingDeclarationServiceMock);
        clientConfigServiceMock = MockContext.useMock(ClientConfigServiceMock);
        userServiceMock = MockContext.useMock(UserServiceMock);
        playerGamingDeclarationTrackingServiceMock = MockContext.useMock(PlayerGamingDeclarationTrackingServiceMock);
        activatedRouteMock = MockContext.useMock(ActivatedRouteMock);
        nativeAppServiceMock = MockContext.useMock(NativeAppServiceMock);
        htmlNodeMock = MockContext.useMock(HtmlNodeMock);
        dslServiceMock = MockContext.useMock(DslServiceMock);

        TestBed.overrideComponent(PlayerGamingDeclarationComponent, {
            set: {
                imports: [FakeTrustAsHtmlPipe],
                providers: [MockContext.providers],
                schemas: [NO_ERRORS_SCHEMA],
            },
        });

        routeDataServiceMock.getInitData.and.returnValue({
            title: '',
            text: 'test content',
            form: {
                accept: {
                    label: 'button=label',
                    htmlAttributes: {
                        class: 'test-class',
                    },
                },
            },
        });
        activatedRouteMock.snapshot.queryParamMap.get.and.returnValue('1');
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PlayerGamingDeclarationComponent);
        component = fixture.componentInstance;
    });

    it('should initialize correctly', fakeAsync(() => {
        fixture.detectChanges();
        dslServiceMock.evaluateContent.next({
            title: '',
            text: 'test content',
            form: {
                accept: {
                    label: 'button=label',
                    htmlAttributes: {
                        class: 'test-class',
                    },
                },
            },
        });

        expect(component.content()).toEqual(<any>{
            title: '',
            text: 'test content',
            form: {
                accept: {
                    label: 'button=label',
                    htmlAttributes: {
                        class: 'test-class',
                    },
                },
            },
        });
        expect(playerGamingDeclarationTrackingServiceMock.trackLoad).toHaveBeenCalledWith(true);
        expect(htmlNodeMock.setCssClass).toHaveBeenCalledWith('gaming-declaration', true);
    }));

    it('should destroy correctly', () => {
        component.ngOnDestroy();

        expect(htmlNodeMock.setCssClass).toHaveBeenCalledWith('gaming-declaration', false);
    });

    describe('Accept()', () => {
        it('should reload client config and navigate', fakeAsync(() => {
            fixture.detectChanges();
            gamingDeclarationServiceMock.accept.and.returnValue(of({}));

            component.accept();
            clientConfigServiceMock.reload.resolve();
            userServiceMock.gamingDeclarationFlag = 'Y';
            tick();

            expect(nativeAppServiceMock.sendToNative).toHaveBeenCalledWith({ eventName: 'GAMING_DECLARATION_ACCEPTED' });
            expect(clientConfigServiceMock.reload).toHaveBeenCalledWith([ClaimsConfig]);
            expect(gamingDeclarationServiceMock.setCookie).not.toHaveBeenCalled();
            expect(navigationServiceMock.goToLastKnownProduct).toHaveBeenCalledWith({ forceReload: true });
            expect(playerGamingDeclarationTrackingServiceMock.trackAccept).toHaveBeenCalledWith(true);
        }));

        it('should save to cookie in case user property not updated after client config reload', fakeAsync(() => {
            activatedRouteMock.snapshot.queryParamMap.get.and.returnValue('25');
            fixture.detectChanges();
            gamingDeclarationServiceMock.accept.and.returnValue(of({}));

            component.accept();
            clientConfigServiceMock.reload.resolve();
            tick();

            expect(gamingDeclarationServiceMock.setCookie).toHaveBeenCalled();
            expect(playerGamingDeclarationTrackingServiceMock.trackAccept).toHaveBeenCalledWith(false);
        }));
    });
});
