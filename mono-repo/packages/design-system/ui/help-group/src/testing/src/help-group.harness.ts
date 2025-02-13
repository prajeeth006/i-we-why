import { BaseHarnessFilters, ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';

import { DsHelpItemHarness } from './help-item.harness';

export type DsHelpGroupFilters = {
    /** Only find instances which match the given inverse state. */
    inverse?: boolean;

    /** Only find instances which match the given header. */
    headerText?: string;
} & BaseHarnessFilters;

export class DsHelpGroupHarness extends ComponentHarness {
    static hostSelector = 'ds-help-group';

    private headerText = this.locatorFor('.ds-help-text-group-header');
    private contentEl = this.locatorFor('.ds-help-text-group-content');
    private helpItems = this.locatorForAll(DsHelpItemHarness);

    // Factory method for creating an Help Group Harness with specific filters.
    static with(options: DsHelpGroupFilters): HarnessPredicate<DsHelpGroupHarness> {
        return new HarnessPredicate(DsHelpGroupHarness, options)
            .addOption('inverse', options.inverse, async (harness, inverse) => (await harness.isInverse()) === inverse)
            .addOption('headerText', options.headerText, async (harness, title) => HarnessPredicate.stringMatches(harness.getHeaderText(), title));
    }

    /** Gets a promise for the header text. */
    async getHeaderText(): Promise<string> {
        const textElement = await this.headerText();
        return textElement.text();
    }

    async getContent(): Promise<string> {
        const textElement = await this.contentEl();
        return textElement.text();
    }

    async getHelpItems(): Promise<DsHelpItemHarness[]> {
        return await this.helpItems();
    }

    /** Gets a boolean promise indicating if the help group is inversed. */
    async isInverse(): Promise<boolean> {
        const host = await this.host();
        return await host.hasClass('ds-help-text-group-inverse');
    }
}
