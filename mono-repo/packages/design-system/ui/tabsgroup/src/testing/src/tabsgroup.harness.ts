import { BaseHarnessFilters, ComponentHarness, ComponentHarnessConstructor, HarnessPredicate, parallel } from '@angular/cdk/testing';

import { TabsGroupIndicatorType, TabsGroupSizesType, TabsGroupVariantsType } from '@frontend/ui/tabsgroup';

import { DsTabHarness, DsTabHarnessFilters } from './tab-harness';

export type DsTabsGroupHarnessFilters = {
    size?: TabsGroupSizesType;
    variant?: TabsGroupVariantsType;
    indicator?: TabsGroupIndicatorType;
    scrollable?: boolean;
    fullWidth?: boolean;
} & BaseHarnessFilters;

export class DsTabsGroupHarness extends ComponentHarness {
    static hostSelector = `ds-tabs-group`;

    headerContainer = this.locatorFor('.ds-tab-header-container');
    headerItemsList = this.locatorFor('.ds-tab-header-items');

    static with<T extends DsTabsGroupHarness>(this: ComponentHarnessConstructor<T>, options: DsTabsGroupHarnessFilters = {}): HarnessPredicate<T> {
        return new HarnessPredicate(this, options)
            .addOption('fullWidth', options.fullWidth, async (harness, fullWidth) => (await harness.isFullWidth()) === fullWidth)
            .addOption('scrollable', options.scrollable, async (harness, scrollable) => (await harness.isScrollable()) === scrollable)
            .addOption('size', options.size, (harness, size) => harness.isSize(size))
            .addOption('indicator', options.indicator, (harness, indicator) => harness.hasIndicator(indicator))
            .addOption('variant', options.variant, (harness, variant) => harness.isVariant(variant));
    }

    /**
     * Gets the list of tabs in the tab group.
     * @param filter Optionally filters which tabs are included.
     */
    async getTabs(filter: DsTabHarnessFilters = {}): Promise<DsTabHarness[]> {
        return this.locatorForAll(DsTabHarness.with(filter))();
    }

    /** Gets the selected tab of the tab group. */
    async getSelectedTab(): Promise<DsTabHarness> {
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
    async selectTab(filter: DsTabHarnessFilters = {}): Promise<void> {
        const tabs = await this.getTabs(filter);
        if (tabs.length === 0) {
            throw new Error(`Cannot find ds-tab matching filter ${JSON.stringify(filter)}`);
        }
        await tabs[0].select();
    }

    async isFullWidth(): Promise<boolean> {
        return (await this.headerItemsList()).hasClass('ds-tab-full-width');
    }

    async isScrollable(): Promise<boolean> {
        return (await this.headerContainer()).hasClass('ds-tab-nav-enabled');
    }

    async isSize(size: TabsGroupSizesType): Promise<boolean> {
        const host = await this.host();
        const classes = {
            small: 'ds-tabs-small',
            large: 'ds-tabs-large',
        };
        return (await host.hasClass(classes[size])) || false;
    }

    async hasIndicator(indicator: TabsGroupIndicatorType): Promise<boolean> {
        const host = await this.host();
        const classes = {
            underline: 'ds-tab-underline',
            fill: 'ds-tab-fill',
        };
        return (await host.hasClass(classes[indicator])) || false;
    }

    async isVariant(variant: TabsGroupVariantsType): Promise<boolean> {
        const tabs = await this.getTabs();

        if (tabs.length > 0) {
            if (variant === 'horizontal') {
                return await tabs[0].isHorizontal();
            } else if (variant === 'vertical') {
                return await tabs[0].isVertical();
            }
        }
        return false;
    }

    /** Gets a boolean promise indicating if the tabsgroup is inversed. */
    async isInverse(): Promise<boolean> {
        const host = await this.host();
        return await host.hasClass('ds-tabs-inverse');
    }
}
