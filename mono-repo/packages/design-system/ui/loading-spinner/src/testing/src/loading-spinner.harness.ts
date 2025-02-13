import { BaseHarnessFilters, ComponentHarness, HarnessPredicate, TestElement } from '@angular/cdk/testing';

export type DsLoadingSpinnerHarnessFilters = BaseHarnessFilters;

export class DsLoadingSpinnerHarness extends ComponentHarness {
    static hostSelector = 'ds-loading-spinner';

    // Factory method for creating a BadgeHarness with specific filters.
    static with(options: DsLoadingSpinnerHarnessFilters): HarnessPredicate<DsLoadingSpinnerHarness> {
        return new HarnessPredicate(DsLoadingSpinnerHarness, options);
    }

    /** Method to get the applied classes from the host element */
    async getHostClasses(): Promise<string | null> {
        return (await this.host()).getAttribute('class');
    }

    /** Gets the SVG element representing the loading spinner */
    async getSvg(): Promise<TestElement> {
        return await this.locatorFor('svg')();
    }

    /** Checks if the loading spinner SVG is present and has the correct class */
    async hasSvgClass(expectedClass: string): Promise<boolean> {
        const svg = await this.getSvg();
        const svgClass = await svg.getAttribute('class');
        return svgClass?.includes(expectedClass) ?? false;
    }

    /** Retrieves the value of the aria-live attribute */
    async getAriaLive(): Promise<string | null> {
        return (await this.host()).getAttribute('aria-live');
    }

    /** Retrieves the value of the aria-busy attribute */
    async getAriaBusy(): Promise<string | null> {
        return (await this.host()).getAttribute('aria-busy');
    }

    /** Retrieves the value of the aria-label attribute */
    async getAriaLabel(): Promise<string | null> {
        return (await this.host()).getAttribute('aria-label');
    }

    /** Retrieves the value of the role attribute */
    async getRole(): Promise<string | null> {
        return (await this.host()).getAttribute('role');
    }
}
