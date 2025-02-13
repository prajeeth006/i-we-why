import { Component, DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, NgForm } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { MaxDirective } from '@frontend/vanilla/shared/forms';

@Component({
    template: `
        <form>
            <input type="number" name="number" ngModel [max]="limit" />
        </form>
    `,
})
class TestComponent {
    limit = 10;
}

describe('MaxDirective', () => {
    let fixture: ComponentFixture<TestComponent>;
    let debug: DebugElement;
    let component: TestComponent;
    let form: NgForm;
    let inputElement: DebugElement;
    let input: HTMLInputElement;
    let limit: number;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [FormsModule, MaxDirective],
            declarations: [TestComponent],
            providers: [],
            schemas: [NO_ERRORS_SCHEMA],
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TestComponent);
        debug = fixture.debugElement;
        component = fixture.componentInstance;
        limit = component.limit;

        fixture.detectChanges();

        form = debug.children[0]!.injector.get(NgForm);
        inputElement = fixture.debugElement.query(By.directive(MaxDirective));
        input = inputElement.nativeElement as HTMLInputElement;
    });

    it('should pass with value equal to max', waitForAsync(() => {
        setValueAsync(limit).then((control) => expect(control?.valid).toBeTrue());
    }));

    it('should pass with value lower than max', waitForAsync(() => {
        setValueAsync(--limit).then((control) => expect(control?.valid).toBeTrue());
    }));

    it('should fail with value higher than max', waitForAsync(() => {
        setValueAsync(++limit).then((control) => {
            expect(control?.valid).toBeFalse();
            expect(control?.errors).toEqual({ actualValue: 11, requiredValue: 10, max: true });
        });
    }));

    it('should re-validate when max changes', waitForAsync(() => {
        const value = component.limit;
        setValueAsync(value)
            .then((control) => {
                expect(control?.valid).withContext('expected to be valid initially').toBeTrue();
                component.limit = component.limit / 2;
                fixture.detectChanges();

                return setValueAsync(value);
            })
            .then((control) => {
                expect(control?.valid).withContext('expected to be invalid when max was lower').toBeFalse();
                expect(control?.errors).toEqual({ actualValue: 10, requiredValue: 5, max: true });
            });
    }));

    function setValueAsync(value: number) {
        return fixture.whenStable().then(() => {
            input.value = '' + value;
            input.dispatchEvent(new Event('input'));
            fixture.detectChanges();
            return form.control.get('number');
        });
    }
});
