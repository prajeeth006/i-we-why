import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FastLoginValue } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { DeviceServiceMock } from '../../../core/test/browser/device.mock';
import { FastLoginComponent } from '../src/fast-login.component';
import { LoginConfigMock, LoginContentServiceMock, LoginServiceMock, LoginTrackingServiceMock } from './login.mocks';

describe('FastLoginComponent', () => {
    let fixture: ComponentFixture<FastLoginComponent>;
    let component: FastLoginComponent;
    let loginContentServiceMock: LoginContentServiceMock;
    let loginServiceMock: LoginServiceMock;
    let deviceServiceMock: DeviceServiceMock;
    let loginTrackingServiceMock: LoginTrackingServiceMock;
    let loginConfigMock: LoginConfigMock;

    beforeEach(() => {
        loginContentServiceMock = MockContext.useMock(LoginContentServiceMock);
        loginServiceMock = MockContext.useMock(LoginServiceMock);
        deviceServiceMock = MockContext.useMock(DeviceServiceMock);
        loginTrackingServiceMock = MockContext.useMock(LoginTrackingServiceMock);
        loginConfigMock = MockContext.useMock(LoginConfigMock);

        loginContentServiceMock.content = <any>{
            form: {
                fastlogindisabled: { label: 'off' },
                autologinenabled: { label: 'autologin' },
                touchid: { label: 'touchid' },
                faceid: { label: 'faceid' },
            },
        };

        TestBed.overrideComponent(FastLoginComponent, {
            set: {
                imports: [],
                providers: [MockContext.providers],
                schemas: [NO_ERRORS_SCHEMA],
            },
        });
    });

    function initComponent() {
        fixture = TestBed.createComponent(FastLoginComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }

    it('should have two fields when keepMeSignedInToggleVisible', () => {
        loginServiceMock.keepMeSignedInToggleVisible = true;
        initComponent();

        expect(component.fields.length).toBe(2);
    });

    it('should have two fields when touchIdToggleVisible', () => {
        loginServiceMock.touchIdToggleVisible = true;
        initComponent();

        expect(component.fields).toEqual([
            { text: 'touchid', value: FastLoginValue.IsTouchIDEnabled },
            { text: 'off', value: FastLoginValue.FastLoginDisabled },
        ]);
        expect(component.fields.length).toBe(2);
    });

    it('should show `touchId`, `autologinenabled` and `fastlogindisabled` fields when keepMeSignedInToggleVisible and touchIdToggleVisible', () => {
        loginServiceMock.touchIdToggleVisible = true;
        loginServiceMock.keepMeSignedInToggleVisible = true;
        initComponent();

        expect(component.fields).toEqual([
            { text: 'touchid', value: FastLoginValue.IsTouchIDEnabled },
            { text: 'autologin', value: FastLoginValue.KeepMeSignedInEnabled },
            { text: 'off', value: FastLoginValue.FastLoginDisabled },
        ]);
        expect(component.fields.length).toBe(3);
    });

    it('should show `faceId`, `autologinenabled` and `fastlogindisabled` fields when keepMeSignedInToggleVisible and faceIdToggleVisible', () => {
        loginServiceMock.faceIdToggleVisible = true;
        loginServiceMock.keepMeSignedInToggleVisible = true;
        initComponent();

        expect(component.fields).toEqual([
            { text: 'faceid', value: FastLoginValue.IsFaceIDEnabled },
            { text: 'autologin', value: FastLoginValue.KeepMeSignedInEnabled },
            { text: 'off', value: FastLoginValue.FastLoginDisabled },
        ]);
        expect(component.fields.length).toBe(3);
    });

    it('should show `touchId`, `autologinenabled` and `fastlogindisabled` fields on android when keepMeSignedInToggleVisible, touchIdToggleVisible and faceIdToggleVisible', () => {
        loginServiceMock.touchIdToggleVisible = true;
        loginServiceMock.faceIdToggleVisible = true;
        loginServiceMock.keepMeSignedInToggleVisible = true;
        initComponent();

        expect(component.fields).toEqual([
            { text: 'touchid', value: FastLoginValue.IsTouchIDEnabled },
            { text: 'autologin', value: FastLoginValue.KeepMeSignedInEnabled },
            { text: 'off', value: FastLoginValue.FastLoginDisabled },
        ]);
        expect(component.fields.length).toBe(3);
    });

    it('should show `faceId`, `autologinenabled` and `fastlogindisabled` fields on iOS when keepMeSignedInToggleVisible, touchIdToggleVisible and faceIdToggleVisible', () => {
        loginServiceMock.touchIdToggleVisible = true;
        loginServiceMock.faceIdToggleVisible = true;
        loginServiceMock.keepMeSignedInToggleVisible = true;
        deviceServiceMock.isiOS = true;
        initComponent();

        expect(component.fields).toEqual([
            { text: 'faceid', value: FastLoginValue.IsFaceIDEnabled },
            { text: 'autologin', value: FastLoginValue.KeepMeSignedInEnabled },
            { text: 'off', value: FastLoginValue.FastLoginDisabled },
        ]);
        expect(component.fields.length).toBe(3);
    });

    it('should track toggle on value change for v2', () => {
        initComponent();
        loginConfigMock.v2 = true;
        component.onValueChange(true);

        expect(loginTrackingServiceMock.trackFastLoginToggle).toHaveBeenCalledOnceWith(true);
    });
});
