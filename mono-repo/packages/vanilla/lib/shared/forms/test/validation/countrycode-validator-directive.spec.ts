import { Component, DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, NgForm } from '@angular/forms';

import { ɵCountryCodeValidatorDirective } from '@frontend/vanilla/shared/forms';
import { MockContext } from 'moxxi';

import { UsernameMobileNumberResourceServiceMock } from '../../../../shared/forms/src/username-mobile-number/username-mobile-resource.service.mocks';

@Component({
    template: `
        <form>
            <input type="text" name="country" ngModel [countrycode]="countryCode" [(ngModel)]="countryCode" />
        </form>
    `,
})
class TestComponent {
    countryCode = '';
}

describe('CountryCodeValidatorDirective', () => {
    let fixture: ComponentFixture<TestComponent>;
    let debug: DebugElement;
    let form: NgForm;
    let component: TestComponent;

    beforeEach(() => {
        MockContext.useMock(UsernameMobileNumberResourceServiceMock);

        TestBed.configureTestingModule({
            imports: [FormsModule, ɵCountryCodeValidatorDirective],
            providers: [MockContext.providers],
            declarations: [TestComponent],
            schemas: [NO_ERRORS_SCHEMA],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TestComponent);
        debug = fixture.debugElement;
        component = fixture.componentInstance;

        fixture.detectChanges();

        form = debug.children[0]!.injector.get(NgForm);
    });

    it('should pass when valid country code', waitForAsync(() => {
        setValueAsync('+43').then((control) => expect(control?.valid).toBeTrue);
    }));

    it('should fail when invalid country code', waitForAsync(() => {
        setValueAsync('+123').then((control) => expect(control?.valid).toBeFalse);
    }));

    function setValueAsync(value: string) {
        component.countryCode = value;
        fixture.detectChanges();
        return fixture.whenStable().then(() => {
            return form.control.get('country');
        });
    }
});
