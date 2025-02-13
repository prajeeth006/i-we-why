import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UntypedFormBuilder } from '@angular/forms';

import { LoginType, UserLoginEvent, ViewTemplateForClient } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { CommonMessagesMock } from '../../../../core/src/client-config/test/common-messages.mock';
import { UserServiceMock } from '../../../../core/test/user/user.mock';
import { ValidationHelperServiceMock } from '../../../../shared/forms/test/forms/validation-helper.mock';
import { OverlayRefMock } from '../../../../shared/overlay-factory/test/cdk-overlay.mock';
import { BetstationLoginCardPinComponent } from '../../src/betstation/betstation-login-card-pin';
import { CARD_NUMBER } from '../../src/betstation/betstation-login.models';
import { DeviceFingerprintServiceMock } from '../device-fingerprint.mock';
import {
    BetstationLoginServiceMock,
    BetstationLoginTrackingServiceMock,
    LoginConfigMock,
    LoginContentServiceMock,
    LoginServiceMock,
} from '../login.mocks';

describe('BetstationLoginCardPinComponent', () => {
    let fixture: ComponentFixture<BetstationLoginCardPinComponent>;
    let component: BetstationLoginCardPinComponent;

    let loginServiceMock: LoginServiceMock;
    let deviceFingerprintServiceMock: DeviceFingerprintServiceMock;
    let userServiceMock: UserServiceMock;
    let overlayRefMock: OverlayRefMock;
    let betstationLoginServiceMock: BetstationLoginServiceMock;
    let loginContentServiceMock: LoginContentServiceMock;

    beforeEach(() => {
        MockContext.useMock(LoginConfigMock);
        MockContext.useMock(CommonMessagesMock);
        loginContentServiceMock = MockContext.useMock(LoginContentServiceMock);
        MockContext.useMock(CommonMessagesMock);
        MockContext.useMock(ValidationHelperServiceMock);
        MockContext.useMock(BetstationLoginTrackingServiceMock);
        overlayRefMock = MockContext.useMock(OverlayRefMock);
        userServiceMock = MockContext.useMock(UserServiceMock);
        loginServiceMock = MockContext.useMock(LoginServiceMock);
        deviceFingerprintServiceMock = MockContext.useMock(DeviceFingerprintServiceMock);
        betstationLoginServiceMock = MockContext.useMock(BetstationLoginServiceMock);

        TestBed.overrideComponent(BetstationLoginCardPinComponent, {
            set: {
                imports: [],
                providers: [MockContext.providers, UntypedFormBuilder, { provide: CARD_NUMBER, useValue: '123456789012' }],
                schemas: [NO_ERRORS_SCHEMA],
            },
        });

        deviceFingerprintServiceMock.get.and.returnValue({});
        loginContentServiceMock.content.children = { gridconnectimage: {} as ViewTemplateForClient };
        loginContentServiceMock.content.form = { pinterminal: {} as ViewTemplateForClient };
    });

    function initComponent() {
        fixture = TestBed.createComponent(BetstationLoginCardPinComponent);
        fixture.detectChanges();
        component = fixture.componentInstance;
    }

    it('should close on UserLoginEvent', () => {
        initComponent();
        userServiceMock.triggerEvent(new UserLoginEvent());

        expect(overlayRefMock.detach).toHaveBeenCalled();
    });

    it('should close on login failed', () => {
        initComponent();
        loginServiceMock.onLoginFailed.next({ reason: { errorCode: '1010' } });

        expect(overlayRefMock.detach).toHaveBeenCalled();
    });

    it('should not close login failed for invalid attempts posapi error', () => {
        initComponent();
        loginServiceMock.onLoginFailed.next({
            reason: {
                errorCode: '600',
                errorValues: { REM_INVALID_PSWD_LOGIN_ATTEMPTS_TO_PSWD_BLOCK: 2 },
            },
        });

        expect(overlayRefMock.detach).not.toHaveBeenCalled();
    });

    it('login', () => {
        initComponent();
        const event = { preventDefault: jasmine.createSpy('preventDefault') } as any;
        component.formGroup.controls['pin']!.setValue('1234');
        component.login(event);

        expect(betstationLoginServiceMock.gridConnectLogin).toHaveBeenCalledWith(
            {
                connectCardNumber: '123456789012',
                pin: '1234',
                fingerprint: {},
                loginType: LoginType.ConnectCard,
            },
            jasmine.anything(),
        );
    });

    it('Should set message on incorrect Pin', () => {
        initComponent();
        betstationLoginServiceMock.onIncorrectPin.next('message');
        expect(component.errorMessage).toBe('message');
    });

    it('should set pin on digitClick', () => {
        initComponent();
        component.digitClick(1);
        expect(component.formGroup.controls['pin']!.value).toBe('1');
        component.digitClick(2);
        expect(component.formGroup.controls['pin']!.value).toBe('12');
        component.digitClick(3);
        expect(component.formGroup.controls['pin']!.value).toBe('123');
        component.digitClick(4);
        expect(component.formGroup.controls['pin']!.value).toBe('1234');

        component.digitClick(5);
        expect(component.formGroup.controls['pin']!.value).toBe('1234');

        component.digitClick(-1);
        expect(component.formGroup.controls['pin']!.value).toBe('');
    });

    it('should close', () => {
        initComponent();
        component.close();

        expect(overlayRefMock.detach).toHaveBeenCalled();
    });
});
