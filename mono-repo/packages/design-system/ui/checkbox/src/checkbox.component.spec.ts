import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DsCheckboxHarness } from '@frontend/ui/checkbox/testing';
import { virtual } from '@guidepup/virtual-screen-reader';

import { DsCheckbox } from './checkbox.component';

describe('DsCheckboxHarness', () => {
    let fixture: ComponentFixture<CheckboxTestContainer>;
    let loader: HarnessLoader;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CheckboxTestContainer],
        }).compileComponents();

        fixture = TestBed.createComponent(CheckboxTestContainer);
        fixture.detectChanges();
        loader = TestbedHarnessEnvironment.loader(fixture);
    });

    it('should find checkbox with specific checked and indeterminate state', async () => {
        fixture.componentRef.setInput('checked', true);
        fixture.componentRef.setInput('indeterminate', false);

        const checkboxes = await loader.getAllHarnesses(DsCheckboxHarness.with({ checked: true, indeterminate: false }));
        expect(checkboxes.length).toBe(1);
    });

    it('should react to checked state changes', async () => {
        fixture.componentRef.setInput('checked', true);

        const checkbox = await loader.getHarness(DsCheckboxHarness.with({ checked: true }));
        expect(await checkbox.isChecked()).toBe(true);
    });

    it('should toggle checked state when clicked', async () => {
        const checkbox = await loader.getHarness(DsCheckboxHarness);
        await checkbox.toggle();
        expect(await checkbox.isChecked()).toBe(true);
        await checkbox.toggle();
        expect(await checkbox.isChecked()).toBe(false);
    });

    it('should reflect indeterminate state', async () => {
        fixture.componentRef.setInput('indeterminate', true);

        const checkbox = await loader.getHarness(DsCheckboxHarness.with({ indeterminate: true }));
        expect(await checkbox.isIndeterminate()).toBe(true);
    });

    it('should reflect disabled state', async () => {
        fixture.componentRef.setInput('disabled', true);

        const checkbox = await loader.getHarness(DsCheckboxHarness.with({ disabled: true }));
        expect(await checkbox.isDisabled()).toBe(true);
    });

    it('should have inverse class when inverse is true', async () => {
        const harness = await loader.getHarness(DsCheckboxHarness);
        expect(await harness.isInverse()).toBeFalsy();
        fixture.componentRef.setInput('inverse', true);
        expect(await harness.isInverse()).toBeTruthy();
        fixture.componentRef.setInput('inverse', false);
        expect(await harness.isInverse()).toBeFalsy();
    });

    it('should get correct label text', async () => {
        const checkbox = await loader.getHarness(DsCheckboxHarness);
        const labelText = await checkbox.getLabelText();
        expect(labelText).toBe('label');
    });

    it('should read checkbox states correctly with screen reader', async () => {
        fixture.detectChanges();
        await fixture.whenStable();

        await virtual.start({ container: fixture.nativeElement });
        expect(await virtual.lastSpokenPhrase()).toBe('checkbox, checkbox, not checked');

        // Test checked state
        fixture.componentRef.setInput('checked', true);
        fixture.detectChanges();
        await fixture.whenStable();

        await new Promise((resolve) => setTimeout(resolve, 100));
        await virtual.stop();
        await virtual.start({ container: fixture.nativeElement });
        expect(await virtual.lastSpokenPhrase()).toBe('checkbox, checkbox, checked');

        // Test indeterminate state
        fixture.componentRef.setInput('indeterminate', true);
        fixture.detectChanges();
        await fixture.whenStable();

        await new Promise((resolve) => setTimeout(resolve, 100));
        await virtual.stop();
        await virtual.start({ container: fixture.nativeElement });
        expect(await virtual.lastSpokenPhrase()).toBe('checkbox, checkbox, partially checked');
    }, 30000);
});

@Component({
    standalone: true,
    imports: [DsCheckbox, NgIf],
    template: `
        <ds-checkbox [inverse]="inverse" [checked]="checked" [indeterminate]="indeterminate" [disabled]="disabled" [size]="size">label</ds-checkbox>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
class CheckboxTestContainer {
    @Input()
    checked = false;
    @Input()
    inverse = false;
    @Input()
    indeterminate = false;
    @Input()
    disabled = false;
    @Input()
    size = 'large';
}
