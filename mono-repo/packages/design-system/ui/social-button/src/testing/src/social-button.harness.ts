import { BaseHarnessFilters, ComponentHarness, ComponentHarnessConstructor, HarnessPredicate, TestElement } from '@angular/cdk/testing';
import { booleanAttribute } from '@angular/core';

import { DsSocialButtonAppArray, DsSocialButtonSize, DsSocialButtonVariant } from '@frontend/ui/social-button';

export type DsSocialButtonHarnessFilters = {
    /** Only find instances whose text matches the given value. */
    text?: string | RegExp;

    /** Only find instances with a type. */
    type?: 'submit' | 'button' | 'reset';

    /** Only find instances with a certain variant */
    variant?: DsSocialButtonVariant;

    /** Only find instances with a certain size */
    size?: DsSocialButtonSize;

    /** Only find instances with a certain social app */
    socialApp?: DsSocialButtonAppArray;

    /** Only find instances which match the given disabled state. */
    disabled?: boolean;
} & BaseHarnessFilters;

export class DsSocialButtonHarness extends ComponentHarness {
    static hostSelector = `[ds-social-button]`;

    private textEl = this.locatorFor('.ds-social-btn-text');

    static with<T extends DsSocialButtonHarness>(
        this: ComponentHarnessConstructor<T>,
        options: DsSocialButtonHarnessFilters = {},
    ): HarnessPredicate<T> {
        return new HarnessPredicate(this, options)
            .addOption('text', options.text, (harness, text) => HarnessPredicate.stringMatches(harness.getText(), text))
            .addOption('type', options.type, (harness, type) => HarnessPredicate.stringMatches(harness.getType(), type))
            .addOption('size', options.size, (harness, size) => harness.hasSize(size))
            .addOption('variant', options.variant, (harness, variant) => harness.hasVariant(variant))
            .addOption('socialApp', options.socialApp, (harness, app) => harness.hasSocialApp(app))
            .addOption('disabled', options.disabled, async (harness, disabled) => (await harness.isDisabled()) === disabled);
    }

    /** Clicks the button. */
    async click(): Promise<void> {
        return (await this.host()).click();
    }

    /** Gets a boolean promise indicating if the button is disabled. */
    async isDisabled(): Promise<boolean> {
        return booleanAttribute(await (await this.host()).getAttribute('disabled'));
    }

    /** Gets a promise for the button's label text. */
    async getText(): Promise<string> {
        return (await this.textEl()).text();
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
    async hasSize(size: DsSocialButtonSize): Promise<boolean> {
        const classList = (await this.getHostClasses())?.split(' ');
        return classList?.some((x) => x.includes(size)) ?? false;
    }

    /** Checks if a specific variant is applied. **/
    async hasVariant(variant: DsSocialButtonVariant): Promise<boolean> {
        const classList = (await this.getHostClasses())?.split(' ');
        return classList?.includes(variant) ?? false;
    }

    /** Checks if a specific variant is applied. **/
    async hasSocialApp(app: DsSocialButtonAppArray): Promise<boolean> {
        const classList = (await this.getHostClasses())?.split(' ');
        return classList?.some((x) => x.includes(app)) ?? false;
    }

    /** Retrieves the entire slot as a TestElement for complex content analysis.*/
    async getStartSlotElement(): Promise<TestElement | null> {
        return this.locatorForOptional('[slot=start]')();
    }
}
