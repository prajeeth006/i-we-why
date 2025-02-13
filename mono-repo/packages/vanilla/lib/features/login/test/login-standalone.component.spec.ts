import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WINDOW } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { WindowMock } from '../../../core/src/browser/window/test/window-ref.mock';
import { HtmlNodeMock } from '../../../core/test/browser/html-node.mock';
import { LoginNavigationServiceMock } from '../../../core/test/login/navigation-service.mocks';
import { NavigationServiceMock, ParsedUrlMock } from '../../../core/test/navigation/navigation.mock';
import { UrlServiceMock } from '../../../core/test/navigation/url.mock';
import { UserServiceMock } from '../../../core/test/user/user.mock';
import { LoginStandaloneComponent } from '../src/login-standalone.component';

describe('LoginStandaloneComponent', () => {
    let fixture: ComponentFixture<LoginStandaloneComponent>;
    let component: LoginStandaloneComponent;
    let navigationServiceMock: NavigationServiceMock;
    let loginNavigationServiceMock: LoginNavigationServiceMock;
    let userServiceMock: UserServiceMock;
    let windowMock: WindowMock;
    let htmlNodeMock: HtmlNodeMock;
    let urlServiceMock: UrlServiceMock;

    beforeEach(() => {
        navigationServiceMock = MockContext.useMock(NavigationServiceMock);
        loginNavigationServiceMock = MockContext.useMock(LoginNavigationServiceMock);
        userServiceMock = MockContext.useMock(UserServiceMock);
        windowMock = new WindowMock();
        htmlNodeMock = MockContext.useMock(HtmlNodeMock);
        urlServiceMock = MockContext.useMock(UrlServiceMock);

        TestBed.overrideComponent(LoginStandaloneComponent, {
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
    });
    function initComponent() {
        fixture = TestBed.createComponent(LoginStandaloneComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }

    it('should redirect if authenticate users access the login page', () => {
        userServiceMock.isAuthenticated = true;

        initComponent();

        expect(loginNavigationServiceMock.goToStoredReturnUrl).toHaveBeenCalled();
    });

    it('should setup login-page class', () => {
        initComponent();

        expect(htmlNodeMock.setCssClass).toHaveBeenCalledWith('login-page', true);
    });

    it('should remove login-page class', () => {
        initComponent();
        component.ngOnDestroy();

        expect(htmlNodeMock.setCssClass).toHaveBeenCalledWith('login-page', false);
    });

    it('should not redirect if unauthenticated users', () => {
        userServiceMock.isAuthenticated = false;
        initComponent();
        expect(loginNavigationServiceMock.goToStoredReturnUrl).not.toHaveBeenCalled();
    });

    describe('back', () => {
        let parsedUrlMock: ParsedUrlMock;

        beforeEach(() => {
            parsedUrlMock = new ParsedUrlMock();
            parsedUrlMock.isSameTopDomain = true;
            urlServiceMock.parse.and.callFake(() => parsedUrlMock);
        });

        it('should call goToWithCurrentLang if cancelUrl is passed', () => {
            initComponent();
            navigationServiceMock.location.search.set('cancelUrl', 'http://cancelUrl');

            component.back();
            expect(loginNavigationServiceMock.goToWithCurrentLang).toHaveBeenCalledWith('http://cancelUrl');
        });

        it('should call goToLastKnownProduct if rurlauth=1', () => {
            navigationServiceMock.location.search.set('rurlauth', '1');
            initComponent();

            component.back();
            expect(navigationServiceMock.goToLastKnownProduct).toHaveBeenCalled();
        });

        it('should call goToLastKnownProduct if history is empty', () => {
            initComponent();

            component.back();
            expect(navigationServiceMock.goToLastKnownProduct).toHaveBeenCalled();
        });

        it('should call history.back', () => {
            windowMock.history.length = 1;
            initComponent();

            component.back();
            expect(windowMock.history.back).toHaveBeenCalled();
        });

        it('should not navigate to cancelUrl when not same top domain', () => {
            parsedUrlMock.isSameTopDomain = false;

            navigationServiceMock.location.search.set('cancelUrl', 'http://cancelUrl');
            initComponent();
            component.back();
            expect(loginNavigationServiceMock.goToWithCurrentLang).not.toHaveBeenCalled();
        });
    });
});
