import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { UntypedFormBuilder } from '@angular/forms';

import { ConnectCardLoginEvent } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { CommonMessagesMock } from '../../../../core/src/client-config/test/common-messages.mock';
import { DeviceServiceMock } from '../../../../core/test/browser/device.mock';
import { RememberMeConfigMock } from '../../../../core/test/login/remember-me/remember-me.config.mock';
import { WebWorkerServiceMock } from '../../../../core/test/web-worker/web-worker.service.mock';
import { ValidationHelperServiceMock } from '../../../../shared/forms/test/forms/validation-helper.mock';
import { TestReCaptchaComponent } from '../../../recaptcha/test/recaptcha.mock';
import { ConnectCardLoginOptionComponent } from '../../src/login-options/connect-card-login-option.component';
import { LoginConfigMock, LoginServiceMock, LoginTrackingServiceMock } from '../login.mocks';

describe('ConnectCardLoginOptionComponent', () => {
    let fixture: ComponentFixture<ConnectCardLoginOptionComponent>;
    let component: ConnectCardLoginOptionComponent;
    let loginService: LoginServiceMock;
    let validationHelper: ValidationHelperServiceMock;
    let loginTrackingServiceMock: LoginTrackingServiceMock;
    let loginConfigMock: LoginConfigMock;

    beforeEach(() => {
        loginService = MockContext.useMock(LoginServiceMock);
        validationHelper = MockContext.useMock(ValidationHelperServiceMock);
        loginTrackingServiceMock = MockContext.useMock(LoginTrackingServiceMock);
        loginConfigMock = MockContext.useMock(LoginConfigMock);
        MockContext.useMock(RememberMeConfigMock);
        MockContext.useMock(DeviceServiceMock);
        MockContext.useMock(CommonMessagesMock);
        MockContext.useMock(WebWorkerServiceMock);

        TestBed.overrideComponent(ConnectCardLoginOptionComponent, {
            set: {
                imports: [],
                providers: [MockContext.providers, UntypedFormBuilder],
                schemas: [NO_ERRORS_SCHEMA],
            },
        });
    });

    function initComponent() {
        fixture = TestBed.createComponent(ConnectCardLoginOptionComponent);
        component = fixture.componentInstance;

        component.content = <any>{
            form: {
                connectCardNumber: { validation: {} },
                pin: { validation: {} },
                connectcardoption: { values: [{ value: 'text', text: 'forgotten pin' }] },
            },
        };
        fixture.detectChanges();
        component.reCaptcha = new TestReCaptchaComponent() as any;
    }

    it('should create component', () => {
        initComponent();
        expect(component).not.toBeNull();
        expect(component.text).toBe('forgotten pin');
    });

    it('should configure form validators', () => {
        initComponent();
        expect(validationHelper.createValidators).toHaveBeenCalledWith('connectcardnumber');
        expect(validationHelper.createValidators).toHaveBeenCalledWith('pin');
    });

    it('should handle login failed', () => {
        initComponent();
        loginService.onLoginFailed.next({ reason: { errorCode: 'bar' } });

        expect(component.reCaptcha.reload).toHaveBeenCalled();
        expect(loginTrackingServiceMock.trackTabbedLoginFailed).toHaveBeenCalled();
    });

    it('login should emit login type', () => {
        initComponent();
        loginConfigMock.recaptchaEnterpriseEnabled = false;
        component.formGroup.get('connectCardNumber')!.setValue('123');
        component.formGroup.get('pin')!.setValue(369);
        component.formGroup.get('rememberme')!.setValue(true);

        let value: ConnectCardLoginEvent = <any>null;
        component.submit.subscribe((v: ConnectCardLoginEvent) => (value = v));
        component.login(new Event('click'));

        expect(component.reCaptcha.execute).not.toHaveBeenCalled();
        expect(value).toEqual(<any>{ connectCardNumber: '123', pin: 369, captcharesponse: '', rememberme: true });
    });

    it('login should call recaptcha execute if enabled', fakeAsync(() => {
        initComponent();
        loginConfigMock.recaptchaEnterpriseEnabled = true;

        component.login(new Event('click'));
        tick();
        expect(component.reCaptcha.execute).toHaveBeenCalled();
    }));

    it('should emmit onBack click', () => {
        initComponent();
        const spy = spyOn(component.onBack, 'emit');
        component.onBackClick();

        expect(spy).toHaveBeenCalled();
    });
});
