import { BaseHarnessFilters, ComponentHarness, HarnessPredicate, TestElement } from '@angular/cdk/testing';
import { booleanAttribute } from '@angular/core';

export type DsNumpadHarnessFilters = {
    /** Only find instances whose text matches the given value. */
    okText?: string | RegExp;

    /** Only find instances whose numberSeparator matches the given value. */
    numberSeparator?: string | RegExp;

    /** Only find instances which match the given inverse state. */
    inverse?: boolean;
} & BaseHarnessFilters;

export class DsNumpadHarness extends ComponentHarness {
    static hostSelector = 'ds-numpad';

    private okTextEl = this.locatorFor('.ds-numpad-ok');
    private numberSeparatorEl = this.locatorFor('[data-testid="ds-numpad-separator"]');
    private removeEl = this.locatorFor('[data-testid="ds-numpad-remove"]');

    // Factory method for creating a BadgeHarness with specific filters.
    static with(options: DsNumpadHarnessFilters): HarnessPredicate<DsNumpadHarness> {
        return new HarnessPredicate(DsNumpadHarness, options)
            .addOption('okText', options.okText, (harness, text) => HarnessPredicate.stringMatches(harness.getOkText(), text))
            .addOption('numberSeparator', options.numberSeparator, (harness, text) =>
                HarnessPredicate.stringMatches(harness.getNumberSeparatorText(), text),
            )
            .addOption('inverse', options.inverse, async (harness, inverse) => (await harness.isInverse()) === inverse);
    }

    /** Gets a promise for the button's label text. */
    async getOkText(): Promise<string> {
        return (await this.okTextEl()).text();
    }

    /** Gets a promise for the button's label text. */
    async getNumberSeparatorText(): Promise<string> {
        return (await this.getNumberSeparatorButton()).text();
    }

    /** Method to get the applied classes from the host element */
    async getHostClasses(): Promise<string | null> {
        return (await this.host()).getAttribute('class');
    }

    /** Gets a boolean promise indicating if the button is inversed. */
    async isInverse(): Promise<boolean> {
        const host = await this.host();
        return booleanAttribute(await host.getAttribute('inverse')) || (await host.hasClass('ds-numpad-inverse'));
    }

    async getOkButton(): Promise<TestElement> {
        return await this.okTextEl();
    }

    async getNumberSeparatorButton(): Promise<TestElement> {
        return await this.numberSeparatorEl();
    }

    async getRemoveButton(): Promise<TestElement> {
        return await this.removeEl();
    }

    async getButtonWithNumber(number: string): Promise<TestElement> {
        const buttons = await this.locatorForAll('.ds-numpad-btn')();
        for (const button of buttons) {
            if ((await button.text()) === number) {
                return button;
            }
        }
        throw new Error('Button not found');
    }

    async clickAllButtons() {
        const buttons = await this.locatorForAll('.ds-numpad-btn')();
        for (const button of buttons) {
            await button.click();
        }
    }
}
