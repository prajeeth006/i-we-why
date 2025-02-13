import { BaseHarnessFilters, ComponentHarness, HarnessPredicate, TestElement } from '@angular/cdk/testing';

import { DsCardFooterVariant } from '@frontend/ui/card-footer';

export type DsCardFooterHarnessFilters = {
    variant?: DsCardFooterVariant;
} & BaseHarnessFilters;

export class DsCardFooterHarness extends ComponentHarness {
    static hostSelector = 'ds-card-footer';

    // Factory method for creating a CardFooterHarness with specific filters.
    static with(options: DsCardFooterHarnessFilters): HarnessPredicate<DsCardFooterHarness> {
        return new HarnessPredicate(DsCardFooterHarness, options).addOption('variant', options.variant, (harness, variant) =>
            harness.hasVariant(variant),
        );
    }

    /** Method to get the applied classes from the host element */
    async getHostClasses(): Promise<string | null> {
        return (await this.host()).getAttribute('class');
    }

    /** Retrieves the entire slot as a TestElement for complex content analysis. */
    async getDividerSlotElement(): Promise<TestElement | null> {
        return this.locatorForOptional('[slot=divider]')();
    }

    /** Checks if a specific variant is applied. **/
    async hasVariant(variant: DsCardFooterVariant): Promise<boolean> {
        const classList = await this.getHostClasses();
        const variantClass = `ds-card-footer-${variant}`;
        return classList?.includes(variantClass) ?? false;
    }

    /** Checks content text. **/
    async getText(): Promise<string> {
        return (await this.host()).text();
    }
}
