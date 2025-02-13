import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UntypedFormBuilder } from '@angular/forms';

import { LoginOption, MessageScope, QuerySearchParams } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { LoginStoreServiceMock } from '../../../../core/test/login/login-store.mock';
import { MessageQueueServiceMock } from '../../../../core/test/messages/message-queue.mock';
import { NavigationServiceMock } from '../../../../core/test/navigation/navigation.mock';
import { LoginOptionTabsComponent } from '../../src/login-options/login-option-tabs.component';
import { LoginTrackingServiceMock } from '../login.mocks';

describe('LoginOptionTabsComponent', () => {
    let fixture: ComponentFixture<LoginOptionTabsComponent>;
    let component: LoginOptionTabsComponent;
    let messageQueueServiceMock: MessageQueueServiceMock;
    let navigationServiceMock: NavigationServiceMock;
    let loginStoreServiceMock: LoginStoreServiceMock;
    let loginTrackingServiceMock: LoginTrackingServiceMock;

    const userPwdOption = { id: 'userpwdoption', label: 'Email & PWd' };
    const connectCardOption = { id: 'connectcardoption', label: 'Connect card' };

    beforeEach(() => {
        messageQueueServiceMock = MockContext.useMock(MessageQueueServiceMock);
        loginTrackingServiceMock = MockContext.useMock(LoginTrackingServiceMock);
        navigationServiceMock = MockContext.useMock(NavigationServiceMock);
        loginStoreServiceMock = MockContext.useMock(LoginStoreServiceMock);

        TestBed.overrideComponent(LoginOptionTabsComponent, {
            set: {
                imports: [],
                providers: [MockContext.providers, UntypedFormBuilder],
                schemas: [NO_ERRORS_SCHEMA],
            },
        });
    });

    function createComponent(selected: boolean = true) {
        fixture = TestBed.createComponent(LoginOptionTabsComponent);
        component = fixture.componentInstance;

        component.loginContent = <any>{
            form: {
                emailoption: { ...userPwdOption, values: [] },
                connectcardoption: { ...connectCardOption, values: [{ value: 'selected', text: selected ? 'true' : '' }] },
            },
        };

        component.loginOptions = [userPwdOption.id, connectCardOption.id];
    }

    it('should create configured tabs with initially selected option', () => {
        createComponent();

        fixture.detectChanges();

        expect(component.formGroup.get('loginType')?.value).toEqual({ ...connectCardOption, selected: true });
        expect(component.loginTypeOptions).toEqual([
            { ...userPwdOption, selected: false },
            { ...connectCardOption, selected: true },
        ]);
        expect(loginTrackingServiceMock.trackTabbedLoginAction).toHaveBeenCalledWith({
            actionEvent: 'Loaded',
            locationEvent: 'Login Tabbed',
            eventDetails: 'connectcardoption',
        });
    });

    it('should save cookie if origin query parameter is send', () => {
        navigationServiceMock.location.search = new QuerySearchParams('origin=connectcardoption');
        createComponent(false);

        fixture.detectChanges();

        expect(loginStoreServiceMock.SelectedTab).toBe('connectcardoption');
        expect(component.formGroup.get('loginType')?.value).toEqual({ ...connectCardOption, selected: true });
    });

    it('should emit select on value changes and save cookie', () => {
        createComponent();
        fixture.detectChanges();

        let selected = connectCardOption;
        component.select.subscribe((v: LoginOption) => (selected = v));
        component.formGroup.get('loginType')?.setValue(userPwdOption);

        expect(selected.id).toEqual(userPwdOption.id);
        expect(loginStoreServiceMock.SelectedTab).toBe(userPwdOption.id);
        expect(loginTrackingServiceMock.trackTabbedLoginAction).toHaveBeenCalledWith({
            actionEvent: 'Loaded',
            locationEvent: 'Login Tabbed',
            eventDetails: 'userpwdoption',
        });
    });

    it('should have only cookie option set as selected when there is also a selected item from sitecore', () => {
        navigationServiceMock.location.search = new QuerySearchParams('origin=userpwdoption');
        createComponent();
        fixture.detectChanges();

        expect(component.loginTypeOptions).toEqual([
            { ...userPwdOption, selected: true },
            { ...connectCardOption, selected: false },
        ]);
    });

    describe('messageQueue', () => {
        beforeEach(() => {
            createComponent();
            fixture.detectChanges();
        });

        it('should be cleared on value changes', () => {
            component.formGroup.get('loginType')?.setValue(userPwdOption);

            expect(messageQueueServiceMock.clear).toHaveBeenCalledWith({ clearPersistent: true, scope: MessageScope.Login });
        });
    });
});
