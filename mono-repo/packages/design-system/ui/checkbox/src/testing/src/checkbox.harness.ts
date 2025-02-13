import { BaseHarnessFilters, ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';

export type DsCheckboxHarnessFilters = {
    /** Only find instances whose checked state matches the given value. */
    checked?: boolean;

    /** Only find instances whose indeterminate state matches the given value. */
    indeterminate?: boolean;

    /** Only find instances whose disabled state matches the given value. */
    disabled?: boolean;
} & BaseHarnessFilters;

export class DsCheckboxHarness extends ComponentHarness {
    static hostSelector = 'ds-checkbox';

    static with(options: DsCheckboxHarnessFilters = {}): HarnessPredicate<DsCheckboxHarness> {
        return new HarnessPredicate(DsCheckboxHarness, options)
            .addOption('checked', options.checked, async (harness, checked) => (await harness.isChecked()) === checked)
            .addOption('indeterminate', options.indeterminate, async (harness, indeterminate) => (await harness.isIndeterminate()) === indeterminate)
            .addOption('disabled', options.disabled, async (harness, disabled) => (await harness.isDisabled()) === disabled);
    }

    private _checkbox = this.locatorFor('input[type="checkbox"]');
    private _labelText = this.locatorFor('.ds-checkbox-label-text');

    async isChecked(): Promise<boolean> {
        const checkbox = await this._checkbox();
        return checkbox.getProperty<boolean>('checked');
    }

    /** Gets a boolean promise indicating if the checkbox is inversed. */
    async isInverse(): Promise<boolean> {
        const host = await this.host();
        return await host.hasClass('ds-checkbox-inverse');
    }

    async isIndeterminate(): Promise<boolean> {
        const checkbox = await this._checkbox();
        return checkbox.getProperty<boolean>('indeterminate');
    }

    async isDisabled(): Promise<boolean> {
        const checkbox = await this._checkbox();
        return checkbox.getProperty<boolean>('disabled');
    }

    async toggle(): Promise<void> {
        const checkbox = await this._checkbox();
        await checkbox.click();
    }

    async getLabelText(): Promise<string> {
        const label = await this._labelText();
        return label.text();
    }
}
