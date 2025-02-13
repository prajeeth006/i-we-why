import { BaseHarnessFilters, ComponentHarness, HarnessPredicate, TestElement } from '@angular/cdk/testing';
import { booleanAttribute } from '@angular/core';

import { DsCardExpandableVariant } from '@frontend/ui/card-expandable';
import { DsCardHeaderVariant } from '@frontend/ui/card-header';

export type DsCardExpandableHarnessFilters = {
    /** Only find instances whose text matches the given value. */
    title?: string;

    /** Only find instances whose subtext matches the given value. */
    subtitle?: string;

    expandable?: boolean;
    variant?: DsCardExpandableVariant;
    headerVariant?: DsCardHeaderVariant;

    elevated?: boolean;
} & BaseHarnessFilters;

export class DsCardExpandableHarness extends ComponentHarness {
    static hostSelector = 'ds-card-expandable';

    private titleEl = this.locatorFor('.ds-card-header-title');
    private subTextEl = this.locatorForOptional('.ds-card-header-subtitle');
    private toggleIconEl = this.locatorFor('.ds-icon-button');
    private cardHeaderEl = this.locatorFor('.ds-card-header');

    static with(options: DsCardExpandableHarnessFilters): HarnessPredicate<DsCardExpandableHarness> {
        return new HarnessPredicate(DsCardExpandableHarness, options)
            .addOption('titleText', options.title, (harness, text) => HarnessPredicate.stringMatches(harness.getTitle(), text))
            .addOption('subtitleText', options.subtitle, (harness, text) => HarnessPredicate.stringMatches(harness.getSubText(), text))
            .addOption('elevated', options.elevated, async (harness, elevated) => (await harness.isElevated()) === elevated)
            .addOption('variant', options.variant, (harness, variant) => harness.hasVariant(variant))
            .addOption('headerVariant', options.headerVariant, (harness, headerVariant) => harness.hasHeaderVariant(headerVariant));
    }

    /** Method to get the applied classes from the host element */
    async getHostClasses(): Promise<string | null> {
        return (await this.host()).getAttribute('class');
    }

    /** Gets a boolean promise indicating if card is elevated. */
    async isElevated(): Promise<boolean> {
        const card = await this.host();
        return booleanAttribute(await card.getAttribute('elevated')) || !(await card.hasClass('ds-card-expandable-no-elevation'));
    }

    /** Gets a promise for the card header */
    async getCardHeader(): Promise<TestElement | null> {
        return this.locatorFor('ds-card-header')();
    }

    /** Gets a promise for the card header's label text. */
    async getTitle(): Promise<string> {
        return (await this.titleEl()).text();
    }

    /** Gets a promise for the card header's subtitle text. */
    async getSubText(): Promise<string | null> {
        const subTextElement = await this.subTextEl();
        return subTextElement ? subTextElement.text() : null;
    }

    /** Retrieves the entire slot as a TestElement for complex content analysis.*/
    async getStartSlotElement(): Promise<TestElement | null> {
        return this.locatorForOptional('[slot=start]')();
    }

    /** Retrieves the entire slot as a TestElement for complex content analysis. */
    async getTitleSlotElement(): Promise<TestElement | null> {
        return this.locatorForOptional('[slot=title]')();
    }

    /** Retrieves the entire slot as a TestElement for complex content analysis. */
    async getEndSlotElement(): Promise<TestElement | null> {
        return this.locatorForOptional('[slot=end]')();
    }

    /** Toggles the expanded state of the card. */
    async toggleExpand(): Promise<void> {
        await (await this.toggleIconEl()).click();
    }

    /** Whether the card is expanded. */
    async isExpanded(): Promise<boolean> {
        return (await this.cardHeaderEl()).hasClass('ds-card-header-expanded');
    }

    /** Expands the card if collapsed. */
    async expand(): Promise<void> {
        if (!(await this.isExpanded())) {
            await this.toggleExpand();
        }
    }

    /** Collapses the expansion card if expanded. */
    async collapse(): Promise<void> {
        if (await this.isExpanded()) {
            await this.toggleExpand();
        }
    }

    /** Retrieves card body */
    async getCardBodyElement(): Promise<TestElement | null> {
        return this.locatorFor('.ds-card-expandable-body')();
    }

    /** Checks if a specific variant is applied. **/
    async hasVariant(variant: DsCardExpandableVariant): Promise<boolean> {
        const classList = (await this.getHostClasses())?.split(' ');
        const variantClass = `ds-card-expandable-${variant}`;
        return classList?.includes(variantClass) ?? false;
    }

    /** Checks if a specific header variant is applied. **/
    async hasHeaderVariant(headerVariant: DsCardHeaderVariant): Promise<boolean> {
        const classList = (await this.getHostClasses())?.split(' ');
        const variantClass = `ds-card-expandable-${headerVariant}`;
        return classList?.includes(variantClass) ?? false;
    }
}
