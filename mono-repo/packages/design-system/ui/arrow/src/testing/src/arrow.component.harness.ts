import { BaseHarnessFilters, ComponentHarness, ComponentHarnessConstructor, HarnessPredicate } from '@angular/cdk/testing';

import { DsArrowSize, DsArrowVariant } from '@frontend/ui/arrow';

export type DsArrowHarnessFilters = {
    /** Only find instances with a certain size */
    size?: DsArrowSize;

    /** Only find instances whose size matches the given variant. */
    variant?: DsArrowVariant;
} & BaseHarnessFilters;

export class DsArrowHarness extends ComponentHarness {
    static hostSelector = `.ds-arrow`;

    static with<T extends DsArrowHarness>(this: ComponentHarnessConstructor<T>, options: DsArrowHarnessFilters = {}): HarnessPredicate<T> {
        return new HarnessPredicate(this, options)
            .addOption('size', options.size, (harness, size) => harness.hasSize(size))
            .addOption('variant', options.variant, (harness, variant) => harness.hasVariant(variant));
    }

    /** Clicks the arrow. */
    async click(): Promise<void> {
        return (await this.host()).click();
    }

    /** Checks if a specific size is applied. **/
    async hasSize(size: DsArrowSize): Promise<boolean> {
        const host = await this.host();
        const classes = {
            small: 'ds-arrow-small',
            medium: 'ds-arrow-medium',
            large: 'ds-arrow-large',
        };
        return (await host.hasClass(classes[size])) || false;
    }

    /** Method to get the applied classes from the host element */
    async getHostClasses(): Promise<string | null> {
        return (await this.host()).getAttribute('class');
    }

    /** Checks if a specific variant is applied. **/
    async hasVariant(variant: DsArrowVariant): Promise<boolean> {
        const classList = (await this.getHostClasses())?.split(' ');
        return classList?.includes(`ds-${variant}-arrow`) ?? false;
    }

    /** Gets a boolean promise indicating if the arrow is inversed. */
    async isInverse(): Promise<boolean> {
        const host = await this.host();
        return await host.hasClass('ds-arrow-inverse');
    }

    /** Retrieves the value of the role attribute */
    async getRole(): Promise<string | null> {
        return (await this.host()).getAttribute('role');
    }

    /** Retrieves the value of the aria-label attribute */
    async getAriaLabel(): Promise<string | null> {
        return (await this.host()).getAttribute('aria-label');
    }
}
