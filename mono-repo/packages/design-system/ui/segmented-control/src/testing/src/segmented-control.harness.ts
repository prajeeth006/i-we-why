import { BaseHarnessFilters, ComponentHarness, ComponentHarnessConstructor, HarnessPredicate, parallel } from '@angular/cdk/testing';

import { DsSegmentedOptionHarness, DsSegmentedOptionHarnessFilters } from './segmented-option.harness';

export type DsSegmentedControlHarnessFilters = {
    fullWidth?: boolean;
} & BaseHarnessFilters;

export class DsSegmentedControlHarness extends ComponentHarness {
    static hostSelector = `ds-segmented-control`;

    headerContainer = this.locatorFor('ds-segmented-control-container');
    headerItemsList = this.locatorFor('.ds-segmented-controls');

    static with<T extends DsSegmentedControlHarness>(
        this: ComponentHarnessConstructor<T>,
        options: DsSegmentedControlHarnessFilters = {},
    ): HarnessPredicate<T> {
        return new HarnessPredicate(this, options).addOption(
            'fullWidth',
            options.fullWidth,
            async (harness, fullWidth) => (await harness.isFullWidth()) === fullWidth,
        );
    }

    /**
     * Gets the list of tabs in the tab group.
     * @param filter Optionally filters which tabs are included.
     */
    async getTabs(filter: DsSegmentedOptionHarnessFilters = {}): Promise<DsSegmentedOptionHarness[]> {
        return this.locatorForAll(DsSegmentedOptionHarness.with(filter))();
    }

    // Method to get the 'role' attribute from the control
    async getRole(): Promise<string | null> {
        const hostEl = await this.host();
        return hostEl.getAttribute('role'); // Retrieve the 'role' attribute from the segmented control element
    }

    async selectTabByText(text: string): Promise<void> {
        const tabs = await this.getTabs();
        const tab = tabs.find(async (t) => (await t.getText()) === text);
        if (!tab) {
            throw new Error(`Cannot find tab with text "${text}"`);
        }
        await tab.select();
    }

    async selectTabByName(name: string): Promise<void> {
        const tabs = await this.getTabs();
        const tab = tabs.find(async (t) => (await t.getName()) === name);
        if (!tab) {
            throw new Error(`Cannot find tab with name "${name}"`);
        }
        await tab.select();
    }

    /** Gets the selected tab of the tab group. */
    async getSelectedTab(): Promise<DsSegmentedOptionHarness> {
        const tabs = await this.getTabs();
        const isSelected = await parallel(() => tabs.map((t) => t.isSelected()));
        for (const [i, tab] of tabs.entries()) {
            if (isSelected[i]) {
                return tab;
            }
        }
        throw new Error('No selected tab could be found.');
    }

    /**
     * Selects a tab in this tab group.
     * @param filter An optional filter to apply to the child tabs. The first tab matching the filter
     *     will be selected.
     */
    async selectOption(filter: DsSegmentedOptionHarnessFilters = {}): Promise<void> {
        const tabs = await this.getTabs(filter);
        if (tabs.length === 0) {
            throw new Error(`Cannot find ds-tab matching filter ${JSON.stringify(filter)}`);
        }
        await tabs[0].select();
    }

    async isFullWidth(): Promise<boolean> {
        return (await this.headerItemsList()).hasClass('ds-segment-full-width');
    }

    async getInverse(): Promise<boolean> {
        return (await this.headerItemsList()).hasClass('ds-segment-inverse');
    }
}
