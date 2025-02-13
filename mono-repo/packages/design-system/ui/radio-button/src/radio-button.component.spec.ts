import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { DsRadioGroupHarness } from '@frontend/ui/radio-button/testing';
import { virtual } from '@guidepup/virtual-screen-reader';

import { DsRadioButton, DsRadioGroup } from './radio-button.component';

describe('DsRadioGroup', () => {
    let fixture: ComponentFixture<DsRadioTestContainer>;
    let loader: HarnessLoader;
    let component: DsRadioTestContainer;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FormsModule, DsRadioButton, DsRadioGroup, DsRadioTestContainer],
        }).compileComponents();

        fixture = TestBed.createComponent(DsRadioTestContainer);
        component = fixture.componentInstance;
        loader = TestbedHarnessEnvironment.loader(fixture);
    });

    it('should render ds radio group', async () => {
        const dsRadioGroup = await loader.getAllHarnesses(DsRadioGroupHarness);
        expect(dsRadioGroup.length).toBe(1);
    });

    it('should render correct number of radio buttons', async () => {
        const radioGroup = await loader.getHarness(DsRadioGroupHarness);
        const radioButtons = await radioGroup.getRadioButtons();
        expect(radioButtons.length).toBe(3);
    });

    it('should check the correct radio button', async () => {
        const radioGroup = await loader.getHarness(DsRadioGroupHarness);
        await radioGroup.selectRadioButton(1);
        const radioButtons = await radioGroup.getRadioButtons();
        expect(await radioButtons[1].isSelected()).toBe(true);
    });

    it('should set size property on radio group', async () => {
        component.size = 'large'; // Set the size explicitly
        fixture.detectChanges();
        const radioGroup = await loader.getHarness(DsRadioGroupHarness);
        expect(await radioGroup.getSize()).toBe('large');
    });

    it('should render content in radio button', async () => {
        const radioGroup = await loader.getHarness(DsRadioGroupHarness);
        const radioButtons = await radioGroup.getRadioButtons();
        const label = await radioButtons[0].getRadioText();
        expect(label).toBe('Option 1');
    });

    it('should select radio button by value', async () => {
        const radioGroup = await loader.getHarness(DsRadioGroupHarness);
        await radioGroup.selectRadioButtonByValue('2');
        const radioButtons = await radioGroup.getRadioButtons();
        expect(await radioButtons[1].isSelected()).toBe(true);
    });

    it('should not select radio button if value does not match', async () => {
        component.value = 'Non-existent';
        fixture.detectChanges();
        const radioGroup = await loader.getHarness(DsRadioGroupHarness);
        const radioButtons = await radioGroup.getRadioButtons();
        expect(await radioButtons[0].isSelected()).toBe(false);
        expect(await radioButtons[1].isSelected()).toBe(false);
        expect(await radioButtons[2].isSelected()).toBe(false);
    });

    it('should update value on radio button click', async () => {
        const radioGroup = await loader.getHarness(DsRadioGroupHarness);
        const radioButtons = await radioGroup.getRadioButtons();
        await radioButtons[0].select();
        expect(await radioButtons[0].isSelected()).toBe(true);
        expect(component.value).toBe('1');
    });

    it('should propagate value changes to the parent form', async () => {
        const radioGroup = await loader.getHarness(DsRadioGroupHarness);
        const radioButtons = await radioGroup.getRadioButtons();

        await radioButtons[0].select();
        expect(await radioButtons[0].isSelected()).toBe(true);
        expect(component.value).toBe('1');

        await radioButtons[1].select();
        expect(await radioButtons[1].isSelected()).toBe(true);
        expect(await radioButtons[0].isSelected()).toBe(false);
        expect(component.value).toBe('2');
    });

    it('should select a dynamically added radio button', async () => {
        component.showOption4 = true;
        fixture.detectChanges();

        const radioGroup = await loader.getHarness(DsRadioGroupHarness);
        const radioButtons = await radioGroup.getRadioButtons();
        expect(radioButtons.length).toBe(4);

        await radioButtons[3].select();
        expect(await radioButtons[3].isSelected()).toBe(true);
        expect(component.value).toBe('4');
    });

    it('should navigate through radio buttons correctly with screen reader', async () => {
        fixture.detectChanges();
        await fixture.whenStable();

        await virtual.start({ container: fixture.nativeElement });
        expect(await virtual.lastSpokenPhrase()).toEqual('radiogroup');

        // First radio
        await virtual.next();
        expect(await virtual.lastSpokenPhrase()).toEqual('radio, Option 1, checked, position 1, set size 3');
        await virtual.next();
        expect(await virtual.lastSpokenPhrase()).toEqual('Option 1');

        // Second radio
        await virtual.next();
        expect(await virtual.lastSpokenPhrase()).toEqual('radio, Option 2, not checked, position 2, set size 3');
        await virtual.next();
        expect(await virtual.lastSpokenPhrase()).toEqual('Option 2');

        // Third radio
        await virtual.next();
        expect(await virtual.lastSpokenPhrase()).toEqual('radio, Option 3, not checked, position 3, set size 3, disabled');
        await virtual.next();
        expect(await virtual.lastSpokenPhrase()).toEqual('Option 3');

        await virtual.next();
        expect(await virtual.lastSpokenPhrase()).toEqual('end of radiogroup');

        // Select first radio
        const radioGroup = await loader.getHarness(DsRadioGroupHarness);
        await radioGroup.selectRadioButton(1);
        fixture.detectChanges();
        await fixture.whenStable();

        await virtual.next();
        expect(await virtual.lastSpokenPhrase()).toEqual('radiogroup');

        // Check states after selecting
        await virtual.next();
        expect(await virtual.lastSpokenPhrase()).toEqual('radio, Option 1, not checked, position 1, set size 3');
        await virtual.next();
        expect(await virtual.lastSpokenPhrase()).toEqual('Option 1');

        await virtual.next();
        expect(await virtual.lastSpokenPhrase()).toEqual('radio, Option 2, checked, position 2, set size 3');
        await virtual.next();
        expect(await virtual.lastSpokenPhrase()).toEqual('Option 2');

        await virtual.next();
        expect(await virtual.lastSpokenPhrase()).toEqual('radio, Option 3, not checked, position 3, set size 3, disabled');
        await virtual.next();
        expect(await virtual.lastSpokenPhrase()).toEqual('Option 3');

        await virtual.next();
        expect(await virtual.lastSpokenPhrase()).toEqual('end of radiogroup');
    });
});

@Component({
    standalone: true,
    imports: [DsRadioGroup, DsRadioButton],
    template: `
        <ds-radio-group [size]="size" [value]="value" (valueChange)="onValueChange($event)">
            <ds-radio-button value="1" name="options">Option 1</ds-radio-button>
            <ds-radio-button value="2" name="options">Option 2</ds-radio-button>
            <ds-radio-button value="3" name="options" [disabled]="disabled">Option 3</ds-radio-button>
            @if (showOption4) {
                <ds-radio-button value="4" name="options">Option 4</ds-radio-button>
            }
        </ds-radio-group>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
class DsRadioTestContainer {
    @Input() checked? = true;
    @Input() disabled? = true;
    @Input() size: 'small' | 'large' = 'large';
    @Input() value = '1';
    showOption4 = false;

    onValueChange(newValue: string) {
        this.value = newValue;
    }
}
