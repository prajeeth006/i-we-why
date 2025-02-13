import { BaseHarnessFilters, ComponentHarness, ComponentHarnessConstructor, HarnessPredicate } from '@angular/cdk/testing';
import { booleanAttribute } from '@angular/core';

export interface DsRadioButtonFilters extends BaseHarnessFilters {
    selected?: boolean;
    disabled?: boolean;
}

export class DsRadioButtonHarness extends ComponentHarness {
    static hostSelector = 'ds-radio-button';

    private radioInput = this.locatorFor('input[type="radio"]');

    static with<T extends DsRadioButtonHarness>(this: ComponentHarnessConstructor<T>, options: DsRadioButtonFilters = {}): HarnessPredicate<T> {
        return new HarnessPredicate(this, options)
            .addOption('selected', options.selected, async (harness, selected) => (await harness.isSelected()) === selected)
            .addOption('disabled', options.disabled, async (harness, disabled) => (await harness.isDisabled()) === disabled);
    }

    async getRadioText(): Promise<string> {
        return await (await this.host()).text();
    }

    async isSelected(): Promise<boolean> {
        return (await this.radioInput()).getProperty('checked');
    }

    async isDisabled(): Promise<boolean> {
        return booleanAttribute(await (await this.radioInput()).getAttribute('disabled'));
    }

    async select(): Promise<void> {
        return (await this.radioInput()).click();
    }

    async getRadioValue(): Promise<string | null> {
        return (await this.radioInput()).getProperty('value');
    }
}
