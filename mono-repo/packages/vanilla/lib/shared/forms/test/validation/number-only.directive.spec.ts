import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { NumberOnlyDirective } from '@frontend/vanilla/shared/forms';

@Component({
    template: `
        <form [formGroup]="form">
            <input type="tel" name="test" formControlName="test" lhNumberOnly />
        </form>
    `,
})
class TestHostComponent {
    maxlength = 4;
    form: UntypedFormGroup;

    constructor() {
        this.form = new UntypedFormGroup({
            test: new UntypedFormControl(),
        });
    }
}

describe('NumberOnlyDirective', () => {
    let fixture: ComponentFixture<TestHostComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ReactiveFormsModule, NumberOnlyDirective],
            providers: [],
            declarations: [TestHostComponent],
        });

        fixture = TestBed.createComponent(TestHostComponent);
        fixture.detectChanges();
    });

    describe('input', () => {
        it('should not remove any digit', () => {
            const input = getInput();
            input.value = '55667';
            input.dispatchEvent(new Event('input'));

            expect(input.value).toBe('55667');
        });

        it('should remove non digit characters from input value', () => {
            const input = getInput();
            input.value = 'd556.-9dd';
            input.dispatchEvent(new Event('input'));

            expect(input.value).toBe('5569');
        });

        it('should not do anything when input is empty', () => {
            const input = getInput();
            input.dispatchEvent(new Event('input'));

            expect(input.value).toBe('');
        });
    });

    describe('keyDown', () => {
        it('should prevent typing of non digital characters', () => {
            const input = getInput();
            const event = new KeyboardEvent('keydown', { key: 'n' });
            const preventDefault = spyOn(event, 'preventDefault');
            input.dispatchEvent(event);

            expect(preventDefault).toHaveBeenCalled();
        });

        it('should not prevent typing of digital characters', () => {
            const input = getInput();
            const event = new KeyboardEvent('keydown', { key: '5' });
            const preventDefault = spyOn(event, 'preventDefault');
            input.dispatchEvent(event);

            expect(preventDefault).not.toHaveBeenCalled();
        });
    });

    function getInput() {
        return fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;
    }
});
