import { BaseHarnessFilters, ComponentHarness, HarnessPredicate, TestElement } from '@angular/cdk/testing';

import { DsProgressBarFill, DsProgressBarVariant } from '@frontend/ui/progress-bar';

export type DsProgressBarHarnessFilters = {
    /** Only find instances with the given variant (e.g., primary, secondary). */
    variant?: DsProgressBarVariant;

    /** Only find instances with the given fill type (e.g., solid, pattern). */
    fill?: DsProgressBarFill;

    /** Only find instances that show the counter. */
    showCounter?: boolean;

    /** Only find instances with the specified progress value. */
    value?: number;
} & BaseHarnessFilters;

export class DsProgressBarHarness extends ComponentHarness {
    static hostSelector = '.ds-progress-bar';

    private counterEl = this.locatorFor('.ds-progress-bar-counter');

    // Factory method for creating a Progress Bar Harness with specific filters.
    static with(options: DsProgressBarHarnessFilters): HarnessPredicate<DsProgressBarHarness> {
        return new HarnessPredicate(DsProgressBarHarness, options)
            .addOption('variant', options.variant, async (harness, variant) => harness.hasVariant(variant))
            .addOption('fill', options.fill, async (harness, fill) => harness.hasFill(fill))
            .addOption('value', options.value, async (harness, value) => (await harness.getValue()) === value);
    }

    /** Method to get the applied classes from the host element */
    async getHostClasses(): Promise<string | null> {
        return (await this.host()).getAttribute('class');
    }

    /** Gets the variant (e.g., 'primary', 'secondary') of the progress bar. */
    async hasVariant(variant: DsProgressBarVariant): Promise<boolean> {
        const classList = (await this.getHostClasses())?.split(' ');
        return classList?.includes(variant) ?? false;
    }

    /** Gets the fill type of the progress bar (e.g., 'solid', 'pattern'). */
    async hasFill(fill: DsProgressBarFill): Promise<boolean> {
        const classList = (await this.getHostClasses())?.split(' ');
        return classList?.includes(fill) ?? false;
    }

    /** Checks if the progress bar is inverse */
    async getInverse(): Promise<boolean> {
        return (await this.host()).hasClass('ds-progress-bar-inverse');
    }

    /** Checks if the progress bar is showing the counter. */
    async isShowCounter(): Promise<TestElement | null> {
        return await this.counterEl();
    }

    /** Retrieves the entire start slot as a TestElement for complex content analysis. */
    async getStartSlotElement(): Promise<TestElement | null> {
        return this.locatorForOptional('[slot=start]')();
    }

    /** Retrieves the entire end slot as a TestElement for complex content analysis. */
    async getEndSlotElement(): Promise<TestElement | null> {
        return this.locatorForOptional('[slot=end]')();
    }

    /** Gets the progress value (in percentage). */
    async getValue(): Promise<number> {
        const hostElement = await this.host();
        const progressValue = await hostElement.getCssValue('--ds-progress-bar-value');

        if (progressValue && progressValue.endsWith('%')) {
            return parseFloat(progressValue);
        }

        return 0;
    }
}
