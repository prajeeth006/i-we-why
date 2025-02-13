import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, UntypedFormControl } from '@angular/forms';

import { UsernameMobileNumberComponent } from '@frontend/vanilla/shared/forms';
import { MockContext } from 'moxxi';

import { CommonMessagesMock } from '../../../../core/src/client-config/test/common-messages.mock';
import { TrackingServiceMock } from '../../../../core/src/tracking/test/tracking.mock';
import { UserServiceMock } from '../../../../core/test/user/user.mock';
import { UsernameMobileNumberResourceServiceMock } from '../../src/username-mobile-number/username-mobile-resource.service.mocks';

describe('UsernameMobileNumberComponent', () => {
    let fixture: ComponentFixture<UsernameMobileNumberComponent>;
    let component: UsernameMobileNumberComponent;

    let commonMessagesMock: CommonMessagesMock;
    let userServiceMock: UserServiceMock;

    beforeEach(() => {
        commonMessagesMock = MockContext.useMock(CommonMessagesMock);
        userServiceMock = MockContext.useMock(UserServiceMock);
        MockContext.useMock(UsernameMobileNumberResourceServiceMock);
        MockContext.useMock(TrackingServiceMock);

        TestBed.overrideComponent(UsernameMobileNumberComponent, {
            set: {
                imports: [FormsModule],
                schemas: [NO_ERRORS_SCHEMA],
                providers: [MockContext.providers],
            },
        });

        commonMessagesMock['MobileCountryCodeLabel'] = 'Code';
        commonMessagesMock['MobileNumberLabel'] = 'Mobile Number';

        fixture = TestBed.createComponent(UsernameMobileNumberComponent);
        component = fixture.componentInstance;

        component.control = new UntypedFormControl();
    });

    describe('onInit', () => {
        it('should initialize properties', () => {
            userServiceMock.geoCountry = 'AT';
            fixture.detectChanges();

            expect(component.countryCodeText).toEqual('Code');
            expect(component.mobileNumberText).toEqual('Mobile Number');
            expect(component.currentCountryCode).toBe('+43');
        });
    });

    describe('writeValue', () => {
        it('should set model value and change state', () => {
            spyOn(component.isMobileEvent, 'next');
            fixture.detectChanges();

            component.writeValue('+43-66762785616');
            expect(component.model.countryCode).toEqual('+43');
            expect(component.model.userId).toEqual('66762785616');
            expect(component.isMobileNumber).toBeTrue();
            expect(component.isMobileEvent.next).toHaveBeenCalledWith(true);

            component.writeValue('test-username');
            expect(component.model.userId).toEqual('test-username');
            expect(component.isMobileNumber).toBeFalse();
            expect(component.isMobileEvent.next).toHaveBeenCalledWith(false);
        });
    });

    describe('validate', () => {
        it('should validate country code', () => {
            component.isMobileNumber = true;
            component.model.countryCode = '+1';

            fixture.detectChanges();

            const result = component.validate(new UntypedFormControl());

            expect(result).toEqual({ invalidCountryCode: true });
        });
    });

    describe('onCountryChanged', () => {
        it('should format phone number', () => {
            spyOn(component, 'onChange');
            component.isMobileNumber = true;
            component.model.countryCode = '1';
            component.model.userId = '2233445566';
            component.onCountryChanged();

            expect(component.model.countryCode).toBe('+1');
            expect(component.onChange).toHaveBeenCalledWith('+1-2233445566');
        });
    });

    describe('onModelChanged', () => {
        it('should format phone number', () => {
            fixture.detectChanges();
            spyOn(component, 'onChange');
            spyOn(component.isMobileEvent, 'next');
            component.model.countryCode = '+1';
            component.model.userId = '2233445566';
            component.onModelChanged();

            expect(component.onChange).toHaveBeenCalledWith('+1-2233445566');
            expect(component.isMobileEvent.next).toHaveBeenCalledWith(true);

            component.model.userId = 'test-username';
            component.onModelChanged();

            expect(component.onChange).toHaveBeenCalledWith('test-username');
            expect(component.isMobileEvent.next).toHaveBeenCalledWith(false);
        });
    });

    it('userIdBlur should send blur event', () => {
        spyOn(component.onBlurUserId, 'next');
        component.userIdBlur();
        expect(component.onBlurUserId.next).toHaveBeenCalled();
    });

    it('userIdFocus should send focus event', () => {
        spyOn(component.onFocusUserId, 'next');
        component.userIdFocus();
        expect(component.onFocusUserId.next).toHaveBeenCalled();
    });

    it('userIdChanged should send userId changed event', () => {
        spyOn(component.modelChanged, 'next');
        const event = new Event('test');
        component.userIdChanged(event);
        expect(component.modelChanged.next).toHaveBeenCalledWith(event);
    });
});
