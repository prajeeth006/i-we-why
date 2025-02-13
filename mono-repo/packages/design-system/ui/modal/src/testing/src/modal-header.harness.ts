import { BaseHarnessFilters, ComponentHarness, ComponentHarnessConstructor, HarnessPredicate } from '@angular/cdk/testing';

import { DsModalHeaderVariant } from '@frontend/ui/modal';

export type DsModalHeaderHarnessFilters = {
    variant?: DsModalHeaderVariant;
} & BaseHarnessFilters;

export class DsModalHeaderHarness extends ComponentHarness {
    static hostSelector = 'ds-modal-header';

    private headerEl = this.locatorFor('.ds-modal-header');

    static with<T extends DsModalHeaderHarness>(
        this: ComponentHarnessConstructor<T>,
        options: DsModalHeaderHarnessFilters = {},
    ): HarnessPredicate<T> {
        return new HarnessPredicate(this, options).addOption('variant', options.variant, (harness, variant) => harness.hasVariant(variant));
    }

    /** Method to get the applied classes from the host element */
    async getHostClasses(): Promise<string | null> {
        return await (await this.host()).getAttribute('class');
    }

    /** Gets a promise for the modal's content text. */
    async getHeaderText(): Promise<string> {
        const el = await this.headerEl();
        return el.text();
    }

    /** Checks if a specific variant is applied. **/
    async hasVariant(variant: DsModalHeaderVariant): Promise<boolean> {
        const classList = (await this.getHostClasses())?.split(' ');
        return classList?.some((x) => x.includes(variant)) ?? false;
    }
}
