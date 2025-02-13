import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { LoginDialogCloseType, LoginProvider, LoginProviderProfile, MenuAction, UserLoginEvent } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { UtilsServiceMock } from '../../../core/src/utils/test/utils.mock';
import { PageMock } from '../../../core/test/browsercommon/page.mock';
import { MenuActionsServiceMock } from '../../../core/test/menu-actions/menu-actions.mock';
import { NavigationServiceMock } from '../../../core/test/navigation/navigation.mock';
import { UserServiceMock } from '../../../core/test/user/user.mock';
import { LoginWelcomeDialogComponent } from '../src/login-welcome-dialog.component';
import { MatDialogRefMock } from './dialog-ref.mock';
import { LoginConfigMock, LoginContentServiceMock, LoginProvidersServiceMock, LoginTrackingServiceMock } from './login.mocks';

describe('LoginWelcomeDialogComponent', () => {
    let fixture: ComponentFixture<LoginWelcomeDialogComponent>;
    let component: LoginWelcomeDialogComponent;

    let loginContentServiceMock: LoginContentServiceMock;
    let pageMock: PageMock;
    let utilsServiceMock: UtilsServiceMock;
    let matDialogRefMock: MatDialogRefMock;
    let userServiceMock: UserServiceMock;
    let navigationServiceMock: NavigationServiceMock;
    let menuActionsServiceMock: MenuActionsServiceMock;
    let loginProvidersServiceMock: LoginProvidersServiceMock;
    let loginTrackingServiceMock: LoginTrackingServiceMock;
    let loginConfigMock: LoginConfigMock;

    const providerProfileData: LoginProviderProfile = {
        provider: LoginProvider.FACEBOOK,
        origin: 'vanilla.intranet',
        url: 'vanilla.intranet',
        target: '_blank',
        parameters: {},
    };

    beforeEach(() => {
        loginContentServiceMock = MockContext.useMock(LoginContentServiceMock);
        pageMock = MockContext.useMock(PageMock);
        utilsServiceMock = MockContext.useMock(UtilsServiceMock);
        matDialogRefMock = MockContext.useMock(MatDialogRefMock);
        userServiceMock = MockContext.useMock(UserServiceMock);
        navigationServiceMock = MockContext.useMock(NavigationServiceMock);
        menuActionsServiceMock = MockContext.useMock(MenuActionsServiceMock);
        loginProvidersServiceMock = MockContext.useMock(LoginProvidersServiceMock);
        loginTrackingServiceMock = MockContext.useMock(LoginTrackingServiceMock);
        loginConfigMock = MockContext.useMock(LoginConfigMock);

        loginContentServiceMock.content = <any>{
            form: {
                welcomecancelbutton: { htmlAttributes: {} },
                facebookbutton: { values: [{ value: 'culture', text: 'en-US' }] },
            },
        };

        TestBed.overrideComponent(LoginWelcomeDialogComponent, {
            set: {
                imports: [],
                providers: [MockContext.providers, { provide: MAT_DIALOG_DATA, useFactory: () => providerProfileData }],
                schemas: [NO_ERRORS_SCHEMA],
            },
        });
    });

    function initComponent() {
        fixture = TestBed.createComponent(LoginWelcomeDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }

    describe('ngOnInit', () => {
        it('should set welcome description and track', () => {
            pageMock.domain = 'vanilla.intranet';
            utilsServiceMock.format.and.returnValue('Welcome');

            initComponent();

            expect(component.welcomeDescription).toBe('Welcome');
            expect(loginTrackingServiceMock.trackProviderWelcomeScreen).toHaveBeenCalledWith(LoginProvider.FACEBOOK);
        });

        it('location change should close the dialog', () => {
            initComponent();

            navigationServiceMock.locationChange.next({ id: 0, nextUrl: '', previousUrl: '' });

            expect(matDialogRefMock.close).toHaveBeenCalledWith({
                ...providerProfileData,
                closeType: LoginDialogCloseType.LoginOrNavigation,
            });
        });

        it('user login event should close the dialog', () => {
            initComponent();

            userServiceMock.triggerEvent(new UserLoginEvent());

            expect(matDialogRefMock.close).toHaveBeenCalledWith({
                ...providerProfileData,
                closeType: LoginDialogCloseType.LoginOrNavigation,
            });
        });
    });

    describe('loginWithProvider', () => {
        it('should invoke sdkAuth', () => {
            loginConfigMock.providers = <any>{
                facebook: {
                    redirectQueryParams: {
                        trigger: 'login',
                    },
                    sdkLogin: true,
                },
            };

            initComponent();

            component.loginWithProvider();

            expect(loginProvidersServiceMock.sdkAuth).toHaveBeenCalledWith({
                provider: providerProfileData.provider,
                queryParams: { culture: 'en-US' },
                redirectQueryParams: { trigger: 'login' },
            });
            expect(loginProvidersServiceMock.urlAuth).not.toHaveBeenCalled();
        });

        it('should invoke urlAuth', () => {
            loginConfigMock.providers = <any>{
                facebook: {
                    redirectQueryParams: {
                        trigger: 'login',
                    },
                },
            };

            initComponent();

            component.loginWithProvider();

            expect(loginProvidersServiceMock.urlAuth).toHaveBeenCalledWith({
                provider: providerProfileData.provider,
                queryParams: { culture: 'en-US' },
                redirectQueryParams: { trigger: 'login' },
            });
            expect(loginProvidersServiceMock.sdkAuth).not.toHaveBeenCalled();
        });
    });

    describe('close', () => {
        it('should close welcome dialog and track', () => {
            initComponent();

            component.close();

            expect(matDialogRefMock.close).toHaveBeenCalledWith({
                ...providerProfileData,
                closeType: LoginDialogCloseType.CloseButton,
            });
            expect(loginTrackingServiceMock.trackCloseProviderWelcomeScreen).toHaveBeenCalled();
        });
    });

    describe('onWelcomeCancel', () => {
        it('should close welcome dialog; track and open login', () => {
            initComponent();

            component.onWelcomeCancel();

            expect(matDialogRefMock.close).toHaveBeenCalledWith({
                ...providerProfileData,
                closeType: LoginDialogCloseType.CloseButton,
            });
            expect(menuActionsServiceMock.invoke).toHaveBeenCalledWith(MenuAction.GOTO_LOGIN, 'vanilla.intranet', [
                'vanilla.intranet',
                '_blank',
                { welcomeCancel: true },
            ]);
            expect(loginTrackingServiceMock.trackLoginWithDifferentProvider).toHaveBeenCalled();
        });
    });
});
