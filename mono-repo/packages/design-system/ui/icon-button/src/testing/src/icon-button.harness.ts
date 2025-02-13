import { BaseHarnessFilters, ComponentHarness, ComponentHarnessConstructor, HarnessPredicate, TestElement } from '@angular/cdk/testing';
import { booleanAttribute } from '@angular/core';

import { DsIconButtonKind, DsIconButtonSizes, DsIconButtonVariant } from '@frontend/ui/icon-button';

export type DsIconButtonHarnessFilters = {
    /** Only find instances whose text matches the given value. */
    text?: string | RegExp;

    /** Only find instances with a type. */
    type?: 'submit' | 'button' | 'reset';

    /** Only find instances with a certain variant */
    variant?: DsIconButtonVariant;

    /** Only find instances with a certain size */
    size?: DsIconButtonSizes;

    /** Only find instances with a certain kind */
    kind?: DsIconButtonKind;

    /** Only find instances which match the given disabled state. */
    disabled?: boolean;
} & BaseHarnessFilters;

export class DsIconButtonHarness extends ComponentHarness {
    static hostSelector = `[ds-icon-button]`;

    static with<T extends DsIconButtonHarness>(this: ComponentHarnessConstructor<T>, options: DsIconButtonHarnessFilters = {}): HarnessPredicate<T> {
        return new HarnessPredicate(this, options)
            .addOption('type', options.type, (harness, type) => HarnessPredicate.stringMatches(harness.getType(), type))
            .addOption('size', options.size, (harness, size) => harness.hasSize(size))
            .addOption('variant', options.variant, (harness, variant) => harness.hasVariant(variant))
            .addOption('kind', options.kind, (harness, kind) => harness.hasKind(kind))
            .addOption('disabled', options.disabled, async (harness, disabled) => (await harness.isDisabled()) === disabled);
    }

    /** Clicks the button. */
    async click(): Promise<void> {
        return (await this.host()).click();
    }

    /** Gets a boolean promise indicating if the button is disabled. */
    async isDisabled(): Promise<boolean> {
        return (await this.getHostClasses())?.includes('ds-btn-icon-disabled') ?? false;
    }

    /** Focuses the button and returns a void promise that indicates when the action is complete. */
    async focus(): Promise<void> {
        return (await this.host()).focus();
    }

    /** Blurs the button and returns a void promise that indicates when the action is complete. */
    async blur(): Promise<void> {
        return (await this.host()).blur();
    }

    /** Whether the button is focused. */
    async isFocused(): Promise<boolean> {
        return (await this.host()).isFocused();
    }

    /** Gets the type of the button. */
    async getType(): Promise<string | null> {
        const host = await this.host();
        return host.getAttribute('type');
    }

    /** Method to get the applied classes from the host element */
    async getHostClasses(): Promise<string | null> {
        return await (await this.host()).getAttribute('class');
    }

    /** Checks if a specific size is applied. **/
    async hasSize(size: DsIconButtonSizes): Promise<boolean> {
        const classList = (await this.getHostClasses())?.split(' ');
        return classList?.some((x) => x.includes(size)) ?? false;
    }

    /** Checks if a specific variant is applied. **/
    async hasVariant(variant: DsIconButtonVariant): Promise<boolean> {
        const classList = (await this.getHostClasses())?.split(' ');
        return classList?.some((x) => x.includes(variant)) ?? false;
    }

    /** Checks if a specific variant is applied. **/
    async hasKind(kind: DsIconButtonKind): Promise<boolean> {
        const classList = (await this.getHostClasses())?.split(' ');
        return classList?.some((x) => x.includes(kind)) ?? false;
    }

    /** Retrieves the entire slot as a TestElement for complex content analysis.*/
    async getSlotContent(): Promise<TestElement | null> {
        return this.locatorForOptional('.ds-icon-btn-icon')();
    }

    async getInverse(): Promise<boolean | null> {
        const host = await this.host();
        return booleanAttribute(await host.hasClass('ds-btn-inverse'));
    }
}
