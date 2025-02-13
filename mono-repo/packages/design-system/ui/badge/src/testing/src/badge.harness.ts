import { BaseHarnessFilters, ComponentHarness, HarnessPredicate, TestElement } from '@angular/cdk/testing';

import { DsBadgeSize, DsBadgeVariant } from '@frontend/ui/badge';

export type DsBadgeHarnessFilters = {
    /** Only find instances whose label matches the given value. */
    label?: string | RegExp;

    /** Only find instances whose size matches the given value. */
    size?: DsBadgeSize;

    /** Only find instances whose size matches the given variant. */
    variant?: DsBadgeVariant;
} & BaseHarnessFilters;

export class DsBadgeHarness extends ComponentHarness {
    static hostSelector = 'ds-badge';

    private labelEl = this.locatorFor('.ds-badge-text');

    // Factory method for creating a BadgeHarness with specific filters.
    static with(options: DsBadgeHarnessFilters): HarnessPredicate<DsBadgeHarness> {
        return new HarnessPredicate(DsBadgeHarness, options)
            .addOption('label text', options.label, (harness, text) => HarnessPredicate.stringMatches(harness.getLabelText(), text))
            .addOption('size', options.size, (harness, size) => harness.hasSize(size))
            .addOption('variant', options.variant, (harness, variant) => harness.hasVariant(variant));
    }

    /** Gets a promise for the button's label text. */
    async getLabelText(): Promise<string> {
        return (await this.labelEl()).text();
    }

    /** Method to get the applied classes from the host element */
    async getHostClasses(): Promise<string | null> {
        return (await this.host()).getAttribute('class');
    }

    /** Retrieves the entire slot as a TestElement for complex content analysis.*/
    async getStartSlotElement(): Promise<TestElement | null> {
        return this.locatorForOptional('[slot=start]')();
    }

    /** Retrieves the entire slot as a TestElement for complex content analysis. */
    async getEndSlotElement(): Promise<TestElement | null> {
        return this.locatorForOptional('[slot=end]')();
    }

    /** Checks if a specific size is applied. **/
    async hasSize(size: DsBadgeSize): Promise<boolean> {
        const classList = (await this.getHostClasses())?.split(' ');
        return classList?.includes(`ds-badge-${size}`) ?? false;
    }

    /** Checks if a specific variant is applied. **/
    async hasVariant(variant: DsBadgeVariant): Promise<boolean> {
        const classList = (await this.getHostClasses())?.split(' ');
        return classList?.includes(`ds-badge-${variant}`) ?? false;
    }

    /** Gets a boolean promise indicating if the badge is inversed. */
    async isInverse(): Promise<boolean> {
        const host = await this.host();
        return await host.hasClass('ds-badge-inverse');
    }
}
