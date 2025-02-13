import { TestBed } from '@angular/core/testing';

import { LoginProvider, NativeEventType, VanillaEventNames } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { EventsServiceMock } from '../../../core/src/utils/test/utils.mock';
import { LoginStoreServiceMock } from '../../../core/test/login/login-store.mock';
import { NativeAppConfigMock, NativeAppServiceMock } from '../../../core/test/native-app/native-app.mock';
import { NavigationServiceMock, ParsedUrlMock } from '../../../core/test/navigation/navigation.mock';
import { LoginDialogComponent } from '../src/login-dialog.component';
import { LoginDialogService } from '../src/login-dialog.service';
import { LoginOAuthComponent } from '../src/login-oauth.component';
import { LoginWelcomeDialogComponent } from '../src/login-welcome-dialog.component';
import { MatDialogRefMock } from './dialog-ref.mock';
import { MatDialogMock } from './dialog.mock';
import { LoginConfigMock } from './login.mocks';

describe('LoginDialogService', () => {
    let service: LoginDialogService;
    let loginConfigMock: LoginConfigMock;
    let matDialogMock: MatDialogMock;
    let navigationServiceMock: NavigationServiceMock;
    let loginStoreServiceMock: LoginStoreServiceMock;
    let eventsServiceMock: EventsServiceMock;
    let nativeAppConfigMock: NativeAppConfigMock;
    let nativeAppServiceMock: NativeAppServiceMock;
    let matDialogRefMock: MatDialogRefMock;
    const newUrl = new ParsedUrlMock();

    beforeEach(() => {
        navigationServiceMock = MockContext.useMock(NavigationServiceMock);
        loginStoreServiceMock = MockContext.useMock(LoginStoreServiceMock);
        matDialogMock = MockContext.useMock(MatDialogMock);
        loginConfigMock = MockContext.useMock(LoginConfigMock);
        eventsServiceMock = MockContext.useMock(EventsServiceMock);
        nativeAppConfigMock = MockContext.useMock(NativeAppConfigMock);
        nativeAppServiceMock = MockContext.useMock(NativeAppServiceMock);

        TestBed.configureTestingModule({
            providers: [LoginDialogService, MockContext.providers],
        });

        matDialogRefMock = new MatDialogRefMock();
        matDialogMock.open.and.returnValue(matDialogRefMock);
        newUrl.search = navigationServiceMock.location.search;
        navigationServiceMock.location.clone.and.returnValue(newUrl);

        service = TestBed.inject(LoginDialogService);
    });

    describe('init', () => {
        it('should close the login dialog on `LoginDialogClose` event', () => {
            service.open();

            eventsServiceMock.events.next({ eventName: VanillaEventNames.LoginDialogClose });

            expect(matDialogRefMock.close).toHaveBeenCalled();
        });
    });

    describe('open', () => {
        it('should send `OPEN_LOGIN_DIALOG` event to native app', () => {
            nativeAppConfigMock.sendOpenLoginDialogEvent = true;

            service.open();

            expect(nativeAppServiceMock.sendToNative).toHaveBeenCalledOnceWith({ eventName: NativeEventType.OPENLOGINDIALOG });
            expect(matDialogMock.open).not.toHaveBeenCalled();
        });

        it('should open dialog and append dummy parameter to querystring', () => {
            service.open();

            expect(matDialogMock.open).toHaveBeenCalledWith(LoginDialogComponent, {
                data: {},
            });
            expect(newUrl.search.has('q')).toBeTrue();
        });

        it('should open dialog and set return url', () => {
            service.open({ returnUrl: 'returnUrl' });

            expect(matDialogMock.open).toHaveBeenCalledWith(LoginDialogComponent, {
                data: { returnUrl: 'returnUrl' },
            });
            expect(loginStoreServiceMock.ReturnUrlFromLogin).toEqual('returnUrl');
        });

        it('should return dialogRef', () => {
            const actual = service.open({
                returnUrl: 'returnUrl',
                openedBy: 'unit-test',
                restoreFocus: false,
            });

            expect(actual).toBe(<any>matDialogRefMock);
        });

        it('should open dialog with autoFocus from loginConfig', () => {
            loginConfigMock.autoFocusUsername = true;
            service.open();

            expect(matDialogMock.open).toHaveBeenCalledWith(LoginDialogComponent, {
                autoFocus: true,
                data: {},
            });
        });
    });

    describe('openOAuthDialog', () => {
        it('should open LoginOAuthComponent', () => {
            const oAuthDialogData = {
                authorizationCode: '1',
                oAuthProvider: LoginProvider.FACEBOOK,
                oAuthUserId: null,
                requestData: {},
            };

            service.openOAuthDialog(oAuthDialogData);

            expect(matDialogMock.open).toHaveBeenCalledWith(LoginOAuthComponent, { data: oAuthDialogData });
        });
    });

    describe('openWelcomeDialog', () => {
        it('should open LoginWelcomeDialogComponent', () => {
            service.openWelcomeDialog({ provider: LoginProvider.FACEBOOK });

            expect(matDialogMock.open).toHaveBeenCalledWith(LoginWelcomeDialogComponent, {
                data: { provider: LoginProvider.FACEBOOK },
            });
        });
    });

    describe('opened', () => {
        it('should be true after open', () => {
            expect(service.opened).toBeFalse();

            service.open();

            expect(service.opened).toBeTrue();
        });

        it('should be false after dialog is closed', () => {
            expect(service.opened).toBeFalse();

            service.open();

            expect(service.opened).toBeTrue();

            matDialogRefMock.afterClosed.next();

            expect(service.opened).toBeFalse();
        });
    });
});
