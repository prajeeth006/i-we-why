import { Component, DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, NgForm } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { NumberInputDirective } from '@frontend/vanilla/shared/forms';

@Component({
    template: `
        <form>
            <input type="number" name="number" ngModel />
        </form>
    `,
})
class TestComponent {}

describe('NumberInputDirective', () => {
    let fixture: ComponentFixture<TestComponent>;
    let debug: DebugElement;
    let form: NgForm;
    let inputElement: DebugElement;
    let input: HTMLInputElement;
    let directive: NumberInputDirective;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [FormsModule, NumberInputDirective],
            declarations: [TestComponent],
            providers: [],
            schemas: [NO_ERRORS_SCHEMA],
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TestComponent);
        debug = fixture.debugElement;

        fixture.detectChanges();

        form = debug.children[0]!.injector.get(NgForm);
        inputElement = fixture.debugElement.query(By.directive(NumberInputDirective));
        input = inputElement.nativeElement as HTMLInputElement;
        directive = inputElement.injector.get(NumberInputDirective);
    });

    it('should pass when input.validity.badInput is false', waitForAsync(() => {
        const value = 10;
        setValueAsync(value).then((control) => {
            control?.updateValueAndValidity();
            expect(input.value).toBe('' + value);
            expect(control?.valid).toBeTrue();
        });
    }));

    it('should fail when input.validity.badInput is true', waitForAsync(() => {
        spyOnProperty(input.validity, 'badInput', 'get').and.returnValue(true);
        setValueAsync('hello').then((control) => {
            control?.updateValueAndValidity();
            expect(input.value).toBe('');
            expect(control?.valid).toBeFalse();
            expect(control?.errors).toEqual({ number: true });
        });
    }));

    it('should call onTouched() on blur event', waitForAsync(() => {
        const onTouched = spyOn(directive, 'onTouched');
        input.dispatchEvent(new Event('blur'));
        fixture.whenStable().then(() => expect(onTouched).toHaveBeenCalledTimes(1));
    }));

    describe('should revalidate', () => {
        let onChange: jasmine.Spy;

        beforeEach(() => {
            onChange = spyOn(directive, 'onChange');
        });

        it('on change event', waitForAsync(() => {
            input.dispatchEvent(new Event('change'));
            fixture.whenStable().then(() => expect(onChange).toHaveBeenCalledTimes(1));
        }));

        it('on input event', waitForAsync(() => {
            input.dispatchEvent(new Event('input'));
            fixture.whenStable().then(() => expect(onChange).toHaveBeenCalledTimes(1));
        }));
    });

    function setValueAsync(value: any) {
        return fixture.whenStable().then(() => {
            input.value = '' + value;
            input.dispatchEvent(new Event('input'));
            fixture.detectChanges();
            return form.control.get('number');
        });
    }
});
