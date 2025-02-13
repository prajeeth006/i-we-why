import { BaseHarnessFilters, ComponentHarness, ComponentHarnessConstructor, HarnessPredicate } from '@angular/cdk/testing';

import { DsRadioButtonHarness } from './radio-button.harness';

export interface DsRadioGroupFilters extends BaseHarnessFilters {
    size?: 'small' | 'large';
}
export class DsRadioGroupHarness extends ComponentHarness {
    static hostSelector = 'ds-radio-group';

    private radioButtons = this.locatorForAll(DsRadioButtonHarness);

    static with<T extends DsRadioGroupHarness>(this: ComponentHarnessConstructor<T>, options: DsRadioGroupFilters = {}): HarnessPredicate<T> {
        return new HarnessPredicate(this, options).addOption('size', options.size, async (harness, size) => (await harness.getSize()) === size);
    }

    async getRadioButtons(): Promise<DsRadioButtonHarness[]> {
        return this.radioButtons();
    }

    async selectRadioButton(index: number): Promise<void> {
        const radioButtons = await this.getRadioButtons();
        return radioButtons[index].select();
    }

    async selectRadioButtonByValue(value: string): Promise<void> {
        const radioButtons = await this.getRadioButtons();
        for (const radioButton of radioButtons) {
            if ((await radioButton.getRadioValue()) === value) {
                await radioButton.select();
                break;
            }
        }
    }

    async isRadioButtonSelected(index: number): Promise<boolean> {
        const radioButtons = await this.getRadioButtons();
        return radioButtons[index].isSelected();
    }

    async getSize(): Promise<'small' | 'large' | null> {
        const host = await this.host();
        const classAttr = await host.getAttribute('class');
        if (classAttr == null) {
            return null;
        }
        return classAttr.includes('ds-radio-small') ? 'small' : classAttr.includes('ds-radio-large') ? 'large' : null;
    }
}
