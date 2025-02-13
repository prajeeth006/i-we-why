import { BaseHarnessFilters, ComponentHarness, ComponentHarnessConstructor, HarnessPredicate, TestElement } from '@angular/cdk/testing';
import { booleanAttribute } from '@angular/core';

import { DsButtonKind, DsButtonSize, DsButtonVariant } from '@frontend/ui/button';

export type DsButtonHarnessFilters = {
    /** Only find instances whose text matches the given value. */
    text?: string | RegExp;

    /** Only find instances whose subtext matches the given value. */
    subText?: string | RegExp;

    /** Only find instances with a type. */
    type?: 'submit' | 'button' | 'reset';

    /** Only find instances with a certain variant */
    variant?: DsButtonVariant;

    /** Only find instances with a certain size */
    size?: DsButtonSize;

    /** Only find instances with a certain kind */
    kind?: DsButtonKind;

    /** Only find instances which match the given disabled state. */
    disabled?: boolean;

    loading?: boolean;
} & BaseHarnessFilters;

export class DsButtonHarness extends ComponentHarness {
    static hostSelector = `.ds-button`;

    private textEl = this.locatorFor('.ds-btn-text');
    private subTextEl = this.locatorForOptional('.ds-btn-sub-text');

    static with<T extends DsButtonHarness>(this: ComponentHarnessConstructor<T>, options: DsButtonHarnessFilters = {}): HarnessPredicate<T> {
        return new HarnessPredicate(this, options)
            .addOption('text', options.text, (harness, text) => HarnessPredicate.stringMatches(harness.getText(), text))
            .addOption('subText', options.subText, (harness, subText) => HarnessPredicate.stringMatches(harness.getSubText(), subText))
            .addOption('type', options.type, (harness, type) => HarnessPredicate.stringMatches(harness.getType(), type))
            .addOption('size', options.size, (harness, size) => harness.hasSize(size))
            .addOption('variant', options.variant, (harness, variant) => harness.hasVariant(variant))
            .addOption('kind', options.kind, (harness, kind) => harness.hasKind(kind))
            .addOption('loading', options.loading, async (harness, loading) => (await harness.isLoading()) === loading)
            .addOption('disabled', options.disabled, async (harness, disabled) => (await harness.isDisabled()) === disabled);
    }

    /** Clicks the button. */
    async click(): Promise<void> {
        return (await this.host()).click();
    }

    /** Gets a boolean promise indicating if the button is disabled. */
    async isDisabled(): Promise<boolean> {
        const host = await this.host();
        return booleanAttribute(await host.getAttribute('disabled')) || (await host.hasClass('ds-btn-disabled'));
    }

    /** Gets a promise for the button's label text. */
    async getText(): Promise<string> {
        return (await this.textEl()).text();
    }

    /** Gets a promise for the button's label text. */
    async getSubText(): Promise<string | null> {
        return (await this.subTextEl())?.text() ?? null;
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
    async hasSize(size: DsButtonSize): Promise<boolean> {
        const classList = (await this.getHostClasses())?.split(' ');
        return classList?.some((x) => x.includes(size)) ?? false;
    }

    /** Checks if a specific variant is applied. **/
    async hasVariant(variant: DsButtonVariant): Promise<boolean> {
        const classList = (await this.getHostClasses())?.split(' ');
        return classList?.some((x) => x.includes(variant)) ?? false;
    }

    /** Checks if a specific severity is applied. **/
    async hasKind(kind: DsButtonKind): Promise<boolean> {
        const classList = (await this.getHostClasses())?.split(' ');
        return classList?.some((x) => x.includes(kind)) ?? false;
    }

    /** Retrieves the entire slot as a TestElement for complex content analysis.*/
    async getStartSlotElement(): Promise<TestElement | null> {
        return this.locatorForOptional('[slot=start]')();
    }

    /** Retrieves the entire slot as a TestElement for complex content analysis. */
    async getEndSlotElement(): Promise<TestElement | null> {
        return this.locatorForOptional('[slot=end]')();
    }

    async isLoading(): Promise<boolean | null> {
        const host = await this.host();
        return await host.hasClass('ds-button-loading');
    }

    async getInverse(): Promise<boolean | null> {
        const host = await this.host();
        return booleanAttribute(await host.hasClass('ds-btn-inverse'));
    }
}
