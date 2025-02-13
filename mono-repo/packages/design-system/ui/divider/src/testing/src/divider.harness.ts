import { BaseHarnessFilters, ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';

export type DsDividerHarnessFilters = BaseHarnessFilters;

export class DsDividerHarness extends ComponentHarness {
    static hostSelector = 'ds-divider';

    // Factory method for creating an Accordion Harness with specific filters.
    static with(options: DsDividerHarnessFilters): HarnessPredicate<DsDividerHarness> {
        return new HarnessPredicate(DsDividerHarness, options);
    }

    /** Checks the value of the aria-orientation attribute (returns 'vertical' or 'horizontal'). */
    async getAriaOrientation(): Promise<string | null> {
        const host = await this.host();
        return await host.getAttribute('aria-orientation');
    }

    /** Returns true if the aria-orientation is set to 'vertical'. */
    async isVertical(): Promise<boolean> {
        return (await this.getAriaOrientation()) === 'vertical';
    }

    /** Returns true if the aria-orientation is set to 'horizontal'. */
    async isHorizontal(): Promise<boolean> {
        return (await this.getAriaOrientation()) === 'horizontal';
    }

    /** Gets a boolean promise indicating if the divider is inversed. */
    async isInverse(): Promise<boolean> {
        const host = await this.host();
        return await host.hasClass('ds-divider-inverse');
    }
}
