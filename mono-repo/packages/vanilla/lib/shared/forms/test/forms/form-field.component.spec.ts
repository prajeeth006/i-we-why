import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { FormFieldComponent } from '@frontend/vanilla/shared/forms';
import { MockContext } from 'moxxi';

import { CommonMessagesMock } from '../../../../core/src/client-config/test/common-messages.mock';
import { NativeAppConfigMock } from '../../../../core/test/native-app/native-app.mock';
import { ValidationConfigMock } from '../../src/validation/test/validation-config.mock';
import { ValidationHelperServiceMock } from './validation-helper.mock';

@Component({
    template: `
        <form [formGroup]="group">
            <lh-form-field name="input1" [labelText]="label" [floatedLabelText]="floated" [validationMessages]="content.validation">
                <input formControlName="text" type="text" />
            </lh-form-field>
            <lh-form-field name="input2" [labelText]="label">
                <input formControlName="text2" type="text" />
            </lh-form-field>
            <lh-form-field name="input3" [ignoreMaxLength]="true">
                <input formControlName="text3" type="text" />
            </lh-form-field>
            <lh-form-field name="input4" [showTooltips]="true">
                <select formControlName="select"></select>
            </lh-form-field>
            <lh-form-field name="input5" [labelText]="label">
                <input formControlName="text5" type="text" placeholder="PLACEHOLDER TEXT" />
            </lh-form-field>
            <lh-form-field name="input6" [labelText]="label">
                <input formControlName="number" type="number" />
            </lh-form-field>
        </form>
    `,
})
class TestHostComponent {
    group: UntypedFormGroup;
    content = { validation: { required: 'required' } };
    label: string = 'label';
    floated: string = 'floated label';

    constructor() {
        this.group = new UntypedFormGroup({
            text: new UntypedFormControl(''),
            text2: new UntypedFormControl('val'),
            text3: new UntypedFormControl(),
            text5: new UntypedFormControl(),
            number: new UntypedFormControl(),
            select: new UntypedFormControl(),
        });
    }
}

describe('FormFieldComponent', () => {
    let validationHelperMock: ValidationHelperServiceMock;
    let fixture: ComponentFixture<TestHostComponent>;

    beforeEach(() => {
        validationHelperMock = MockContext.useMock(ValidationHelperServiceMock);
        validationHelperMock.getRules.and.returnValue({ maxLength: 5 });
        MockContext.useMock(NativeAppConfigMock);
        MockContext.useMock(CommonMessagesMock);
        MockContext.useMock(ValidationConfigMock);

        TestBed.configureTestingModule({
            imports: [ReactiveFormsModule, FormFieldComponent],
            providers: [MockContext.providers],
            declarations: [TestHostComponent],
            schemas: [NO_ERRORS_SCHEMA],
        });

        fixture = TestBed.createComponent(TestHostComponent);
        fixture.detectChanges();
    });

    it('should add form-control classes', () => {
        const input = getInput();

        expect(input).toHaveClass(['form-control', 'form-control-f-w']);
    });

    it('should display label', () => {
        const label = getLabel();
        expect(label).toBeDefined();
        expect(label).toHaveText('label');
    });

    it('should float label on focus', () => {
        focus();
        fixture.detectChanges();

        expect(getLabel()).toHaveClass('floating-label');
    });

    it('should float label if input has placeholder', () => {
        fixture.detectChanges();

        expect(getLabel(5)).toHaveClass('floating-label');
    });

    it('should unfloat label on focus', () => {
        focus();
        fixture.detectChanges();
        blur();
        fixture.detectChanges();

        expect(getLabel()).not.toHaveClass('floating-label');
    });

    it('should float label if input has value', () => {
        fixture.componentInstance.group.get('text')!.setValue('test');
        fixture.detectChanges();

        expect(getLabel()).toHaveClass('floating-label');

        focus();
        fixture.detectChanges();
        expect(getLabel()).toHaveClass('floating-label');
        blur();
        fixture.detectChanges();
        expect(getLabel()).toHaveClass('floating-label');

        fixture.componentInstance.group.get('number')!.setValue(0);
        fixture.detectChanges();
        expect(getLabel(6)).toHaveClass('floating-label');
    });

    it('should show validation messages', () => {
        expect(getValidationMessages()).toBeDefined();
    });

    it('should show custom messages', () => {
        expect(getCustomTooltips(4)).toBeDefined();
    });

    it('should use label text for floating label if floated text is not specified', () => {
        focus();
        fixture.detectChanges();

        expect(getLabel(2)).toHaveText('label');
    });

    it('should not show label if text is not specified', () => {
        expect(getLabel(3)).toBeNull();
    });

    it('should not show validation messages if not specified', () => {
        expect(getValidationMessages(2)).toBeNull();
    });

    it('should set select class for select', () => {
        expect(getInput(4)).toHaveClass('form-control-select');
    });

    it('should set maxlength attribute for input', () => {
        expect(getInput(1)).toHaveAttr('maxlength', '5');
    });

    it('should not set maxlength attribute if ignoreMaxLength is specified', () => {
        expect(getInput(3)).not.toHaveAttr('maxlength');
    });

    function getLabel(n: number = 1): HTMLLabelElement {
        const e = fixture.debugElement.query(By.css(`[name=input${n}] label.form-group-label`));
        return e && e.nativeElement;
    }

    function getInput(n: number = 1): HTMLInputElement | HTMLSelectElement {
        const e = fixture.debugElement.query(By.css(`[name=input${n}] input, [name=input${n}] select`));
        return e && e.nativeElement;
    }

    function getValidationMessages(n: number = 1): HTMLElement {
        const e = fixture.debugElement.query(By.css(`[name=input${n}] lh-validation-messages`));
        return e && e.nativeElement;
    }

    function getCustomTooltips(n: number = 1): HTMLElement {
        const e = fixture.debugElement.query(By.css(`[name=input${n}] lh-custom-tooltip-messages`));
        return e && e.nativeElement;
    }

    function focus() {
        getInput().dispatchEvent(new FocusEvent('focus'));
    }

    function blur() {
        getInput().dispatchEvent(new FocusEvent('blur'));
    }
});
