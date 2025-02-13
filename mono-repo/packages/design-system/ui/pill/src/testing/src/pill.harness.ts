import { BaseHarnessFilters, ComponentHarness, ComponentHarnessConstructor, HarnessPredicate, TestElement } from '@angular/cdk/testing';
import { booleanAttribute } from '@angular/core';

import { DsPillSize, DsPillVariant } from '@frontend/ui/pill';

export type DsPillHarnessFilters = {
    /** Only find instances whose text matches the given value. */
    text?: string | RegExp;

    /** Only find instances with a certain size */
    size?: DsPillSize;

    /** Only find instances with a certain variant */
    variant?: DsPillVariant;

    /** Only find instances which match the given disabled state. */
    disabled?: boolean;

    /** Only find instances which match the given selected state. */
    selected?: boolean;
} & BaseHarnessFilters;

export class DsPillHarness extends ComponentHarness {
    static hostSelector = `[ds-pill]`;

    private textEl = this.locatorFor('.ds-pill-text');

    static with<T extends DsPillHarness>(this: ComponentHarnessConstructor<T>, options: DsPillHarnessFilters = {}): HarnessPredicate<T> {
        return new HarnessPredicate(this, options)
            .addOption('text', options.text, (harness, text) => HarnessPredicate.stringMatches(harness.getText(), text))
            .addOption('size', options.size, (harness, size) => harness.hasSize(size))
            .addOption('variant', options.variant, (harness, variant) => harness.hasVariant(variant))
            .addOption('disabled', options.disabled, async (harness, disabled) => (await harness.isDisabled()) === disabled)
            .addOption('selected', options.selected, async (harness, selected) => (await harness.isSelected()) === selected);
    }

    /** Clicks the pill. */
    async click(): Promise<void> {
        return (await this.host()).click();
    }

    /** Gets a boolean promise indicating if the pill is disabled. */
    async isDisabled(): Promise<boolean> {
        return booleanAttribute(await (await this.host()).getAttribute('disabled'));
    }

    /** Gets a boolean promise indicating if the pill is disabled. */
    async isSelected(): Promise<boolean> {
        const classList = (await this.getHostClasses())?.split(' ');
        return classList?.includes('ds-pill-selected') ?? false;
    }

    /** Gets a boolean promise indicating if the pill is inversed. */
    async isInverse(): Promise<boolean> {
        const host = await this.host();
        return await host.hasClass('ds-pill-inverse');
    }

    /** Gets a boolean promise indicating whether ds-pill-rounded-padding class is present. */
    async isRoundedPadding(): Promise<boolean> {
        const classList = (await this.getHostClasses())?.split(' ');
        return classList?.includes('ds-pill-rounded-padding') ?? false;
    }

    /** Gets a promise for the pill's label text. */
    async getText(): Promise<string> {
        return (await this.textEl()).text();
    }

    /** Focuses the pill and returns a void promise that indicates when the action is complete. */
    async focus(): Promise<void> {
        return (await this.host()).focus();
    }

    /** Blurs the pill and returns a void promise that indicates when the action is complete. */
    async blur(): Promise<void> {
        return (await this.host()).blur();
    }

    /** Whether the pill is focused. */
    async isFocused(): Promise<boolean> {
        return (await this.host()).isFocused();
    }

    /** Method to get the applied classes from the host element */
    async getHostClasses(): Promise<string | null> {
        return await (await this.host()).getAttribute('class');
    }

    /** Checks if a specific size is applied. **/
    async hasSize(size: DsPillSize): Promise<boolean> {
        const classList = (await this.getHostClasses())?.split(' ');
        return classList?.includes(`ds-pill-${size}`) ?? false;
    }

    async hasVariant(variant: DsPillVariant): Promise<boolean> {
        const classList = (await this.getHostClasses())?.split(' ');
        return classList?.includes(`ds-pill-${variant}`) ?? false;
    }

    /** Retrieves the entire slot as a TestElement for complex content analysis.*/
    async getStartSlotElement(): Promise<TestElement | null> {
        return this.locatorForOptional('[slot=start]')();
    }

    /** Retrieves the entire slot as a TestElement for complex content analysis. */
    async getEndSlotElement(): Promise<TestElement | null> {
        return this.locatorForOptional('[slot=end]')();
    }
}
