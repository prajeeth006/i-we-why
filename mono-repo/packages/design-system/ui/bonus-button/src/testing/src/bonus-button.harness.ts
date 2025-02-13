import { BaseHarnessFilters, ComponentHarness, ComponentHarnessConstructor, HarnessPredicate } from '@angular/cdk/testing';
import { booleanAttribute } from '@angular/core';

import { DsBonusButtonKind } from '@frontend/ui/bonus-button';

export type DsBonusButtonHarnessFilters = {
    /** Only find instances whose text matches the given value. */
    labelText?: string | RegExp;

    /** Only find instances whose label matches the given value. */
    valueText?: string | RegExp;

    /** Only find instances with a type. */
    type?: 'submit' | 'button' | 'reset';

    /** Only find instances with a certain kind */
    kind?: DsBonusButtonKind;

    /** Only find instances which match the given disabled state. */
    disabled?: boolean;
} & BaseHarnessFilters;

export class DsBonusButtonHarness extends ComponentHarness {
    static hostSelector = `[ds-bonus-button]`;

    private textEl = this.locatorFor('.ds-bonus-btn-label');
    private valueEl = this.locatorFor('.ds-bonus-btn-value');

    static with<T extends DsBonusButtonHarness>(
        this: ComponentHarnessConstructor<T>,
        options: DsBonusButtonHarnessFilters = {},
    ): HarnessPredicate<T> {
        return new HarnessPredicate(this, options)
            .addOption('labelText', options.labelText, (harness, text) => HarnessPredicate.stringMatches(harness.getTextLabel(), text))
            .addOption('valueText', options.valueText, (harness, label) => HarnessPredicate.stringMatches(harness.getTextValue(), label))
            .addOption('type', options.type, (harness, type) => HarnessPredicate.stringMatches(harness.getType(), type))
            .addOption('kind', options.kind, (harness, kind) => harness.hasKind(kind))
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
    async getTextLabel(): Promise<string> {
        return (await this.textEl()).text();
    }

    /** Gets a promise for the button's value text. */
    async getTextValue(): Promise<string> {
        return (await this.valueEl()).text();
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

    /** Checks if a specific kind is applied. **/
    async hasKind(kind: DsBonusButtonKind): Promise<boolean> {
        const classList = (await this.getHostClasses())?.split(' ');
        return classList?.some((x) => x.includes(kind)) ?? false;
    }

    /** Gets a boolean promise indicating if the button is inverse. */
    async getInverse(): Promise<boolean | null> {
        const host = await this.host();
        return booleanAttribute(await host.hasClass('ds-btn-inverse'));
    }
}
