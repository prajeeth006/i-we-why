import { BaseHarnessFilters, ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
import { booleanAttribute } from '@angular/core';

import { DsCardVariant } from '@frontend/ui/card';

export type DsCardHarnessFilters = {
    elevated?: boolean;
    variant?: DsCardVariant;
} & BaseHarnessFilters;

export class DsCardHarness extends ComponentHarness {
    static hostSelector = 'ds-card';

    static with(options: DsCardHarnessFilters): HarnessPredicate<DsCardHarness> {
        return new HarnessPredicate(DsCardHarness, options)
            .addOption('elevated', options.elevated, async (harness, elevated) => (await harness.isElevated()) === elevated)
            .addOption('variant', options.variant, (harness, variant) => harness.hasVariant(variant));
    }

    /** Method to get the applied classes from the host element */
    async getHostClasses(): Promise<string | null> {
        return (await this.host()).getAttribute('class');
    }

    /** Gets a boolean promise indicating if card is elevated. */
    async isElevated(): Promise<boolean> {
        const card = await this.host();
        return booleanAttribute(await card.getAttribute('elevated')) || !(await card.hasClass('ds-card-no-elevation'));
    }

    /** Checks if a specific variant is applied. **/
    async hasVariant(variant: DsCardVariant): Promise<boolean> {
        const classList = (await this.getHostClasses())?.split(' ');
        const variantClass = `ds-card-${variant}`;
        return classList?.includes(variantClass) ?? false;
    }
}
