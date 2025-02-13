import { BaseHarnessFilters, ComponentHarness, HarnessPredicate, TestElement } from '@angular/cdk/testing';
import { booleanAttribute } from '@angular/core';

import { DsCardHeaderVariant } from '@frontend/ui/card-header';

export type DsCardHeaderHarnessFilters = {
    /** Only find instances whose text matches the given value. */
    title?: string;

    /** Only find instances whose subtext matches the given value. */
    subtitle?: string;
    variant?: DsCardHeaderVariant;
    expandable?: boolean;
} & BaseHarnessFilters;

export class DsCardHeaderHarness extends ComponentHarness {
    static hostSelector = 'ds-card-header';

    private titleEl = this.locatorFor('.ds-card-header-title');
    private subTextEl = this.locatorForOptional('.ds-card-header-subtitle');
    private toggleIconEl = this.locatorForOptional('.ds-icon-button');

    // Factory method for creating a BadgeHarness with specific filters.
    static with(options: DsCardHeaderHarnessFilters): HarnessPredicate<DsCardHeaderHarness> {
        return new HarnessPredicate(DsCardHeaderHarness, options)
            .addOption('titleText', options.title, (harness, text) => HarnessPredicate.stringMatches(harness.getTitle(), text))
            .addOption('subtitleText', options.subtitle, (harness, text) => HarnessPredicate.stringMatches(harness.getSubText(), text))
            .addOption('expandable', options.expandable, async (harness, expandable) => (await harness.isExpandable()) === expandable)
            .addOption('variant', options.variant, (harness, variant) => harness.hasVariant(variant));
    }

    /** Method to get the applied classes from the host element */
    async getHostClasses(): Promise<string | null> {
        return (await this.host()).getAttribute('class');
    }

    /** Gets a promise for the card header's title text. */
    async getTitle(): Promise<string> {
        return (await this.titleEl()).text();
    }

    /** Gets a promise for the card header's title class. */
    async getTitleClass(): Promise<string | null> {
        return await (await this.titleEl()).getAttribute('class');
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

    /** Checks if the card header is expandable. */
    async isExpandable(): Promise<boolean> {
        return booleanAttribute(await this.toggleIconEl());
    }

    /** Toggles the expanded state of the card header. */
    async toggleExpand(): Promise<void> {
        const toggleIconEl = await this.toggleIconEl();
        if (toggleIconEl) {
            await toggleIconEl.click();
        }
    }

    /** Whether the card header is expanded. */
    async isExpanded(): Promise<boolean> {
        const host = await this.host();
        return await host.hasClass('ds-card-header-expanded');
    }

    /** Expands the card header if collapsed. */
    async expand(): Promise<void> {
        if (!(await this.isExpanded())) {
            await this.toggleExpand();
        }
    }

    /** Collapses the expansion card header if expanded. */
    async collapse(): Promise<void> {
        if (await this.isExpanded()) {
            await this.toggleExpand();
        }
    }

    /** Checks if a specific variant is applied. **/
    async hasVariant(variant: DsCardHeaderVariant): Promise<boolean> {
        const classList = (await this.getHostClasses())?.split(' ');
        const variantClass = `ds-card-header-${variant}`;
        return classList?.includes(variantClass) ?? false;
    }
}
