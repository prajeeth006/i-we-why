import { BaseHarnessFilters, ComponentHarness, HarnessPredicate, TestElement } from '@angular/cdk/testing';
import { booleanAttribute } from '@angular/core';

export type DsListItemHarnessFilters = {
    /** Only find instances whose text matches the given value. */
    title?: string;

    /** Only find instances whose subtitle matches the given value. */
    subtitle?: string;

    /** Only find instances whose subtext matches the given value. */
    subtext?: string;

    /** Only find instances which match the given selected state. */
    selected?: boolean;
} & BaseHarnessFilters;

export class DsListItemHarness extends ComponentHarness {
    static hostSelector = 'ds-list-item';

    private titleEl = this.locatorFor('.ds-list-tile-title');
    private subTitleTextEl = this.locatorForOptional('.ds-list-tile-sub-title');
    private subTextEl = this.locatorForOptional('.ds-list-tile-sub-text');

    // Factory method for creating a BadgeHarness with specific filters.
    static with(options: DsListItemHarnessFilters): HarnessPredicate<DsListItemHarness> {
        return new HarnessPredicate(DsListItemHarness, options)
            .addOption('titleText', options.title, (harness, text) => HarnessPredicate.stringMatches(harness.getTitle(), text))
            .addOption('subtitleText', options.subtitle, (harness, text) => HarnessPredicate.stringMatches(harness.getSubTitleText(), text))
            .addOption('subText', options.subtitle, (harness, text) => HarnessPredicate.stringMatches(harness.getSubText(), text))
            .addOption('selected', options.selected, async (harness, selected) => (await harness.isSelected()) === selected);
    }

    /** Method to get the applied classes from the host element */
    async getHostClasses(): Promise<string | null> {
        return (await this.host()).getAttribute('class');
    }

    /** Gets a promise for the list item title text. */
    async getTitle(): Promise<string> {
        return (await this.titleEl()).text();
    }

    /** Gets a promise for the list item title class. */
    async getTitleClass(): Promise<string | null> {
        return await (await this.titleEl()).getAttribute('class');
    }

    /** Gets a promise for the list item subtitle text. */
    async getSubTitleText(): Promise<string | null> {
        const subTitleTextElement = await this.subTitleTextEl();
        return subTitleTextElement ? subTitleTextElement.text() : null;
    }

    /** Gets a promise for the list item subtext text. */
    async getSubText(): Promise<string | null> {
        const subTextElement = await this.subTextEl();
        return subTextElement ? subTextElement.text() : null;
    }

    /** Gets a boolean promise indicating if the list item is selected. */
    async isSelected(): Promise<boolean> {
        const classList = (await this.getHostClasses())?.split(' ');
        return classList?.includes('ds-list-item-selected') ?? false;
    }

    /** Focuses the list item and returns a void promise that indicates when the action is complete. */
    async focus(): Promise<void> {
        return (await this.host()).focus();
    }

    /** Whether the list item is focused. */
    async isFocused(): Promise<boolean> {
        return (await this.host()).isFocused();
    }

    /** Retrieves the entire slot as a TestElement for complex content analysis.*/
    async getStartSlotElement(): Promise<TestElement | null> {
        return this.locatorForOptional('[slot=start]')();
    }

    /** Retrieves the entire slot as a TestElement for complex content analysis. */
    async getCenterSlotElement(): Promise<TestElement | null> {
        return this.locatorFor('.ds-list-tile-text')();
    }

    /** Retrieves the entire slot as a TestElement for complex content analysis. */
    async getEndSlotElement(): Promise<TestElement | null> {
        return this.locatorForOptional('[slot=end]')();
    }

    async isInverse(): Promise<boolean | null> {
        const host = await this.host();
        return booleanAttribute(await host.hasClass('ds-list-item-inverse'));
    }
}
