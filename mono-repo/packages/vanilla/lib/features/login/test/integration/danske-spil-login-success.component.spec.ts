import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WINDOW } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { WindowMock } from '../../../../core/src/browser/window/test/window-ref.mock';
import { LoginNavigationServiceMock } from '../../../../core/test/login/navigation-service.mocks';
import { NativeAppServiceMock } from '../../../../core/test/native-app/native-app.mock';
import { DanskeSpilLoginSuccessComponent } from '../../src/integration/danske-spil-login-success.component';
import { LoginIntegrationConfigMock } from '../login.mocks';

describe('DanskeSpilLoginSuccessComponent', () => {
    let fixture: ComponentFixture<DanskeSpilLoginSuccessComponent>;
    let windowMock: WindowMock;
    let navigation: LoginNavigationServiceMock;
    let loginIntegrationConfigMock: LoginIntegrationConfigMock;
    let nativeAppServiceMock: NativeAppServiceMock;

    beforeEach(() => {
        navigation = MockContext.useMock(LoginNavigationServiceMock);
        loginIntegrationConfigMock = MockContext.useMock(LoginIntegrationConfigMock);
        nativeAppServiceMock = MockContext.useMock(NativeAppServiceMock);
        windowMock = <any>new WindowMock();
        windowMock.parent = <any>new WindowMock();

        TestBed.overrideComponent(DanskeSpilLoginSuccessComponent, {
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

        navigation.getStoredLoginRedirect.and.returnValue({ url: { absUrl: () => 'eatmeat.com' } });
    });

    function initComponent() {
        fixture = TestBed.createComponent(DanskeSpilLoginSuccessComponent);

        fixture.detectChanges();
        loginIntegrationConfigMock.whenReady.next();
    }

    it('should set href on window parent', () => {
        loginIntegrationConfigMock.options = <any>{ version: 1 };
        nativeAppServiceMock.isDownloadClient = true;
        initComponent();

        expect(windowMock.parent.location.href).toBe('eatmeat.com');
        expect(windowMock.location.href).toBeUndefined();
    });

    it('should NOT set href on window if v2', () => {
        loginIntegrationConfigMock.options = <any>{ version: 2 };
        nativeAppServiceMock.isDownloadClient = true;
        initComponent();

        expect(windowMock.location.href).toBeUndefined();
        expect(windowMock.parent.location.href).toBeUndefined();
    });

    it('should NOT set href on window if not isDownloadClient', () => {
        loginIntegrationConfigMock.options = <any>{ version: 1 };
        initComponent();

        expect(windowMock.location.href).toBeUndefined();
        expect(windowMock.parent.location.href).toBeUndefined();
    });
});
