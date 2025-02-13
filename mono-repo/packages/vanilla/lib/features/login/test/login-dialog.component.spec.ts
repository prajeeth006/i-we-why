import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { LoginDialogData, UserPreHooksLoginEvent } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { NavigationServiceMock } from '../../../core/test/navigation/navigation.mock';
import { UserServiceMock } from '../../../core/test/user/user.mock';
import { LoginDialogComponent } from '../src/login-dialog.component';
import { MatDialogRefMock } from './dialog-ref.mock';

describe('LoginDialogComponent', () => {
    let fixture: ComponentFixture<LoginDialogComponent>;
    let component: LoginDialogComponent;
    let matDialogRefMock: MatDialogRefMock;
    let userServiceMock: UserServiceMock;
    let navigationService: NavigationServiceMock;
    let loginDialogData: LoginDialogData = {};

    beforeEach(() => {
        matDialogRefMock = MockContext.useMock(MatDialogRefMock);
        userServiceMock = MockContext.useMock(UserServiceMock);
        navigationService = MockContext.useMock(NavigationServiceMock);

        TestBed.overrideComponent(LoginDialogComponent, {
            set: {
                imports: [],
                providers: [MockContext.providers, { provide: MAT_DIALOG_DATA, useFactory: () => loginDialogData }],
                schemas: [NO_ERRORS_SCHEMA],
            },
        });
    });

    function initComponent() {
        fixture = TestBed.createComponent(LoginDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }

    it('close() should work', () => {
        loginDialogData = {};
        initComponent();

        component.close();
        expect(matDialogRefMock.close).toHaveBeenCalledWith({ closeType: 'CloseButton' });
    });

    it('UserLoginEvent should call close', () => {
        initComponent();
        userServiceMock.triggerEvent(new UserPreHooksLoginEvent());

        expect(matDialogRefMock.close).toHaveBeenCalled();
    });

    it('UserLoginEvent should call close with data', () => {
        loginDialogData = {
            returnUrl: 'return-url',
            openedBy: 'unit-test',
            closeType: 'LoginOrNavigation',
        };
        initComponent();
        userServiceMock.triggerEvent(new UserPreHooksLoginEvent());

        expect(matDialogRefMock.close).toHaveBeenCalledWith(loginDialogData);
    });

    it('location change should call close', () => {
        initComponent();
        navigationService.locationChange.next({ id: 0, nextUrl: '', previousUrl: '' });

        expect(matDialogRefMock.close).toHaveBeenCalled();
    });
});
