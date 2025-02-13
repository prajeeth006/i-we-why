import { BaseHarnessFilters, ComponentHarness, ComponentHarnessConstructor, HarnessPredicate, TestElement } from '@angular/cdk/testing';
import { booleanAttribute } from '@angular/core';

export type DsSwitchFilters = {
    disabled?: boolean;
} & BaseHarnessFilters;

export class DsSwitchHarness extends ComponentHarness {
    static hostSelector = 'ds-switch';

    private switchInput = this.locatorFor('.ds-switch-custom-input');
    private switchWrapper = this.locatorFor('.ds-switch-label-wrapper');

    // Factory method for creating a SwitchHarness with specific filters.
    static with<T extends DsSwitchHarness>(this: ComponentHarnessConstructor<T>, options: DsSwitchFilters = {}): HarnessPredicate<T> {
        return new HarnessPredicate(this, options).addOption(
            'disabled',
            options.disabled,
            async (harness, disabled) => (await harness.isDisabled()) === disabled,
        );
    }

    /** Clicks the switch. */
    async click(): Promise<void> {
        return (await this.switchWrapper()).click();
    }

    /** Whether the checkbox is disabled. */
    async isDisabled(): Promise<boolean> {
        return booleanAttribute(await (await this.switchInput()).getAttribute('disabled'));
    }

    async hasDisabledClass(): Promise<boolean | null> {
        const classList = (await this.getHostClasses())?.split(' ');
        return classList?.includes('ds-switch-disabled') ?? false;
    }

    async getSwitchVariant(): Promise<string | null> {
        return (await this.switchInput()).getAttribute('type');
    }

    /** Retrieves the entire slot as a TestElement for complex content analysis.*/
    async getSlotElement(slot: string): Promise<TestElement | null> {
        return this.locatorForOptional(slot)();
    }

    async getSwitchValue(): Promise<string | null> {
        return (await this.switchInput()).getProperty('checked');
    }

    /** Method to get the applied classes from the host element */
    async getHostClasses(): Promise<string | null> {
        return (await this.host()).getAttribute('class');
    }
}
