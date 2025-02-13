import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UserConfig } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { TrackingServiceMock } from '../../../core/src/tracking/test/tracking.mock';
import { AuthServiceMock } from '../../../core/test/auth/auth.mock';
import { ClientConfigServiceMock } from '../../../core/test/client-config/client-config.mock';
import { NavigationServiceMock } from '../../../core/test/navigation/navigation.mock';
import { RouteDataServiceMock } from '../../../core/test/routing/route-data.mock';
import { UserServiceMock } from '../../../core/test/user/user.mock';
import { HeaderBarServiceMock } from '../../header-bar/test/header-bar.mocks';
import { LogoutPageComponent } from '../../logout-page/src/logout-page.component';

describe('LogoutPageComponent', () => {
    let fixture: ComponentFixture<LogoutPageComponent>;
    let component: LogoutPageComponent;
    let userServiceMock: UserServiceMock;
    let authServiceMock: AuthServiceMock;
    let clientConfigMock: ClientConfigServiceMock;
    let navigationServiceMock: NavigationServiceMock;
    let routeDataServiceMock: RouteDataServiceMock;
    let trackingServiceMock: TrackingServiceMock;

    beforeEach(() => {
        userServiceMock = MockContext.useMock(UserServiceMock);
        authServiceMock = MockContext.useMock(AuthServiceMock);
        clientConfigMock = MockContext.useMock(ClientConfigServiceMock);
        navigationServiceMock = MockContext.useMock(NavigationServiceMock);
        routeDataServiceMock = MockContext.useMock(RouteDataServiceMock);
        trackingServiceMock = MockContext.useMock(TrackingServiceMock);
        MockContext.useMock(HeaderBarServiceMock);

        TestBed.configureTestingModule({
            declarations: [],
            providers: [MockContext.providers],
            schemas: [NO_ERRORS_SCHEMA],
        });

        routeDataServiceMock.getInitData.and.returnValue({
            content: {
                title: '',
                form: {
                    button: {
                        htmlAttributes: { 'component.EventDetails': 'I understand' },
                    },
                },
                validation: { 'component.EventDetails': 'load' },
            },
        });

        fixture = TestBed.createComponent(LogoutPageComponent);
        component = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
        it('should not call logout when user not authenticated', () => {
            userServiceMock.isAuthenticated = false;

            fixture.detectChanges();

            expect(authServiceMock.logout).not.toHaveBeenCalled();
        });

        it('should call logout when user authenticated', waitForAsync(() => {
            userServiceMock.isAuthenticated = true;
            authServiceMock.logout.and.returnValue(Promise.resolve());

            fixture.detectChanges();

            expect(authServiceMock.logout).toHaveBeenCalledOnceWith({ redirectAfterLogout: false });
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(clientConfigMock.reload).toHaveBeenCalledOnceWith([UserConfig]);
            });
        }));

        it('should track the content view', () => {
            fixture.detectChanges();

            expect(trackingServiceMock.triggerEvent).toHaveBeenCalledOnceWith('contentView', { 'component.EventDetails': 'load' });
        });
    });

    describe('onBackClick', () => {
        it('should track and navigate to the return URL', () => {
            component.onBackClick();

            expect(navigationServiceMock.storeReturnUrl).toHaveBeenCalledTimes(1);
            expect(navigationServiceMock.goToReturnUrl).toHaveBeenCalledTimes(1);
            expect(trackingServiceMock.triggerEvent).toHaveBeenCalledOnceWith('Event.Tracking', { 'component.EventDetails': 'back' });
        });
    });

    describe('onCloseClick', () => {
        it('should track and navigate to the last known product', () => {
            component.onCloseClick();

            expect(navigationServiceMock.goToLastKnownProduct).toHaveBeenCalledTimes(1);
            expect(trackingServiceMock.triggerEvent).toHaveBeenCalledOnceWith('Event.Tracking', { 'component.EventDetails': 'closex' });
        });
    });

    describe('onButtonClick', () => {
        it('should track and navigate to the return URL', () => {
            fixture.detectChanges();

            component.onButtonClick();

            expect(navigationServiceMock.storeReturnUrl).toHaveBeenCalledTimes(1);
            expect(navigationServiceMock.goToReturnUrl).toHaveBeenCalledTimes(1);
            expect(trackingServiceMock.triggerEvent).toHaveBeenCalledWith('Event.Tracking', {
                'component.EventDetails': 'I understand',
            });
        });
    });
});
