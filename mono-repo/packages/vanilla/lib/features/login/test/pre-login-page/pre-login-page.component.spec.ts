import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WINDOW } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { WindowMock } from '../../../../core/src/browser/window/test/window-ref.mock';
import { ContentServiceMock } from '../../../../core/test/content/content.mock';
import { LoginNavigationServiceMock } from '../../../../core/test/login/navigation-service.mocks';
import { NavigationServiceMock } from '../../../../core/test/navigation/navigation.mock';
import { PreLoginPageComponent } from '../../src/pre-login-page/pre-login-page.component';
import { LoginDialogServiceMock } from '../login.mocks';

describe('PreLoginPageComponent', () => {
    let fixture: ComponentFixture<PreLoginPageComponent>;
    let component: PreLoginPageComponent;

    let contentServiceMock: ContentServiceMock;
    let loginDialogService: LoginDialogServiceMock;
    let windowMock: WindowMock;
    let navigationServiceMock: NavigationServiceMock;
    let loginNavigationServiceMock: LoginNavigationServiceMock;

    beforeEach(() => {
        contentServiceMock = MockContext.useMock(ContentServiceMock);
        loginDialogService = MockContext.useMock(LoginDialogServiceMock);
        windowMock = new WindowMock();
        navigationServiceMock = MockContext.useMock(NavigationServiceMock);
        loginNavigationServiceMock = MockContext.useMock(LoginNavigationServiceMock);

        navigationServiceMock.location.search.append('origin', 'Betslip');
        navigationServiceMock.location.search.append('url', 'https://www.bwin.com');

        TestBed.overrideComponent(PreLoginPageComponent, {
            set: {
                imports: [],
                providers: [
                    MockContext.providers,
                    {
                        provide: WINDOW,
                        useValue: windowMock,
                    },
                ],
                schemas: [NO_ERRORS_SCHEMA],
            },
        });
        initComponent();
    });

    function initComponent() {
        fixture = TestBed.createComponent(PreLoginPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        contentServiceMock.getJson.completeWith({
            text: 'Text',
            messages: {
                Register: 'Register',
                Login: 'Login',
                Back: 'Back',
                Origin_Title_Betslip: 'Betslip',
            },
        });
    }

    it('should init', () => {
        expect(component.origin).toBe('Betslip');
        expect(component.title).toBe('Betslip');
    });

    it('should register', () => {
        component.register();

        expect(loginNavigationServiceMock.goToRegistration).toHaveBeenCalledWith({ appendReferrer: 'https://www.bwin.com' });
    });

    it('should login', () => {
        component.login();

        expect(loginDialogService.open).toHaveBeenCalledWith({ returnUrl: 'https://www.bwin.com' });
    });

    it('should go back', () => {
        component.back();

        expect(windowMock.history.back).toHaveBeenCalled();
    });
});
