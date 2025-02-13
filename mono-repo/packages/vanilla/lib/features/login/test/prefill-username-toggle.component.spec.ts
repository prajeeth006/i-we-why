import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { PrefillUsernameToggleComponent } from '../src/prefill-username-toggle.component';
import { LoginConfigMock, LoginContentServiceMock, LoginTrackingServiceMock } from './login.mocks';

describe('PrefillUsernameToggleComponent', () => {
    let fixture: ComponentFixture<PrefillUsernameToggleComponent>;
    let component: PrefillUsernameToggleComponent;
    let loginContentServiceMock: LoginContentServiceMock;
    let trackingService: LoginTrackingServiceMock;
    beforeEach(() => {
        loginContentServiceMock = MockContext.useMock(LoginContentServiceMock);
        trackingService = MockContext.useMock(LoginTrackingServiceMock);
        MockContext.useMock(LoginConfigMock);

        loginContentServiceMock.content = <any>{ form: { prefillusername: { label: 'Remember Username' } } };

        TestBed.overrideComponent(PrefillUsernameToggleComponent, {
            set: {
                imports: [CommonModule],
                providers: [MockContext.providers],
            },
        });
    });

    function initComponent() {
        fixture = TestBed.createComponent(PrefillUsernameToggleComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }

    it('should start with defined properties and methods', () => {
        initComponent();
        expect(component.value).not.toBeDefined();

        expect(component.isDisabled).toBeDefined();
        expect(component.onChange).toBeDefined();
        expect(component.onTouched).toBeDefined();
        expect(component.writeValue).toBeDefined();
        expect(component.registerOnChange).toBeDefined();
        expect(component.registerOnTouched).toBeDefined();
        expect(component.setDisabledState).toBeDefined();
        expect(component.onValueChange).toBeDefined();
    });

    it('onValueChange should update value and call onChange', () => {
        initComponent();
        const onChangeSpy = spyOn(component, 'onChange');

        component.onValueChange(true); // act
        expect(component.value).toBeTrue();
        expect(onChangeSpy).toHaveBeenCalledWith(true);
    });

    describe('tracking', () => {
        it('should track when loaded', () => {
            initComponent(); // act
            expect(trackingService.trackPrefillUsernameLoaded).toHaveBeenCalled();
        });

        const values = [true, false];
        values.forEach((value) => {
            it('should track when value is ' + value, () => {
                initComponent();
                component.onValueChange(value); // act
                expect(trackingService.trackPrefillUsernameClicked).toHaveBeenCalledWith(value);
            });
        });
    });
});
