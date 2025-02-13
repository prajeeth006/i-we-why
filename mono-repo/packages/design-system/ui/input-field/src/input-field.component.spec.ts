import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { virtual } from '@guidepup/virtual-screen-reader';

import { DsInputField } from './input-field.component';
import { DsInputDirective } from './input.directive';
import { DsInputFieldHarness } from './testing/src/input-field.harness';

describe('DsInputFieldHarness with DsInputDirective', () => {
    let fixture: ComponentFixture<InputFieldTestContainer>;
    let loader: HarnessLoader;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ReactiveFormsModule, InputFieldTestContainer],
        }).compileComponents();

        fixture = TestBed.createComponent(InputFieldTestContainer);
        fixture.detectChanges();
        loader = TestbedHarnessEnvironment.loader(fixture);
    });

    it('should find input field with specific value', async () => {
        fixture.componentInstance.form.get('inputControl')?.setValue('Test Value');
        const inputFields = await loader.getAllHarnesses(DsInputFieldHarness.with({ value: 'Test Value' }));
        expect(inputFields.length).toBe(1);
    });

    it('should react to value changes', async () => {
        const inputField = await loader.getHarness(DsInputFieldHarness);
        expect(await inputField.getValue()).toBe('Initial Value');
        fixture.componentInstance.form.get('inputControl')?.setValue('Updated Value');
        expect(await inputField.getValue()).toBe('Updated Value');
    });

    it('should retrieve the correct label text', async () => {
        const inputField = await loader.getHarness(DsInputFieldHarness);
        expect(await inputField.getLabelText()).toBe('Label');
    });

    it('should render a textarea and allow input', async () => {
        const inputField = await loader.getHarness(DsInputFieldHarness);
        const textarea = await inputField.getTextarea();
        await textarea.setInputValue('Test Textarea Input');
        expect(await textarea.getProperty('value')).toBe('Test Textarea Input');
    });

    it('should update character count when typing in textarea', async () => {
        const inputField = await loader.getHarness(DsInputFieldHarness.with({}));
        await inputField.setValue('Test Input');
        const charCount = await inputField.getValue();
        expect(charCount.length).toBe(10);
    });

    it('should display character count span when textarea is focused or has content', async () => {
        const inputField = await loader.getHarness(DsInputFieldHarness.with({}));
        await inputField.setValue('Test Input');
        await inputField.focus();
        const isCharCountVisible = await inputField.isFocusedAndHasContent();
        expect(isCharCountVisible).toBe(true);
    });

    it('should float the label when textarea has content', async () => {
        const inputField = await loader.getHarness(DsInputFieldHarness);
        const textarea = await inputField.getTextarea();
        let isFloating = await inputField.isFloating();
        // expect(isFloating).toBe(false);
        await textarea.setInputValue('Test Floating');
        isFloating = await inputField.isFloating();
        expect(isFloating).toBe(true);
    });

    it('should apply the correct size class for text input', async () => {
        const inputField = await loader.getHarness(DsInputFieldHarness.with({ size: 'small' }));
        expect(await inputField.hasSize('small')).toBe(true);
        fixture.componentRef.setInput('size', 'medium');
        fixture.detectChanges();
        expect(await inputField.hasSize('medium')).toBe(true);
    });

    it('should detect right-aligned text input fields', async () => {
        const inputField = await loader.getHarness(DsInputFieldHarness.with({ isRightAligned: false }));
        fixture.componentRef.setInput('isRightAligned', 'true');
        fixture.detectChanges();
        expect(await inputField.isRightAligned()).toBe(true);
    });

    it('should have inverse class when inverse is true', async () => {
        const harness = await loader.getHarness(DsInputFieldHarness);
        expect(await harness.isInverse()).toBeFalsy();
        fixture.componentRef.setInput('inverse', true);
        expect(await harness.isInverse()).toBeTruthy();
        fixture.componentRef.setInput('inverse', false);
        expect(await harness.isInverse()).toBeFalsy();
    });

    it('should read input field correctly with screen reader', async () => {
        fixture.detectChanges();
        await fixture.whenStable();

        await virtual.start({ container: fixture.nativeElement });
        expect(await virtual.lastSpokenPhrase()).toEqual('form');
        await virtual.next();
        expect(await virtual.lastSpokenPhrase()).toEqual('Label');
        await virtual.next();
        expect(await virtual.lastSpokenPhrase()).toEqual('textbox, Label, Initial Value');
        await virtual.next();
        expect(await virtual.lastSpokenPhrase()).toEqual('textbox');
        await virtual.next();
        expect(await virtual.lastSpokenPhrase()).toEqual('end of form');

        // Test with new value
        await virtual.stop();
        fixture.componentInstance.form.get('inputControl')?.setValue('Updated Value');
        fixture.detectChanges();
        await fixture.whenStable();
        await virtual.start({ container: fixture.nativeElement });
        expect(await virtual.lastSpokenPhrase()).toEqual('form');
        await virtual.next();
        expect(await virtual.lastSpokenPhrase()).toEqual('Label');
        await virtual.next();
        expect(await virtual.lastSpokenPhrase()).toEqual('textbox, Label, Updated Value');
        await virtual.next();
        expect(await virtual.lastSpokenPhrase()).toEqual('textbox');
        await virtual.next();
        expect(await virtual.lastSpokenPhrase()).toEqual('end of form');
    }, 10000);
});

@Component({
    standalone: true,
    imports: [DsInputField, DsInputDirective, ReactiveFormsModule],
    template: `
        <form [formGroup]="form">
            <ds-input-field [labelText]="labelText" [inverse]="inverse" [size]="size" [isRightAligned]="isRightAligned">
                <input dsInput formControlName="inputControl" />
                <textarea dsInput formControlName="inputControl" maxlength="255"></textarea>
            </ds-input-field>
        </form>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
class InputFieldTestContainer {
    @Input() labelText = 'Label';
    @Input() inverse = false;
    @Input() size = 'small';
    @Input() isRightAligned = false;

    form = new FormGroup({
        inputControl: new FormControl('Initial Value'),
    });
}
