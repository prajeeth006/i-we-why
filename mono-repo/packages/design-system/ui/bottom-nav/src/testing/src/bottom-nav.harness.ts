import { ComponentHarness } from '@angular/cdk/testing';

export class DsBottomNavTabHarness extends ComponentHarness {
    static hostSelector = 'ds-bottom-nav-tab';

    async getName(): Promise<string> {
        const host = await this.host();
        const name = await host.getAttribute('name');
        return name || '';
    }

    async onClick(): Promise<void> {
        const host = await this.host();
        return host.click();
    }

    async isDisabled(): Promise<boolean> {
        const host = await this.host();
        const ariaDisabled = await host.getAttribute('aria-disabled');
        return ariaDisabled === 'true';
    }

    async isSelected(): Promise<boolean> {
        const host = await this.host();
        const ariaSelected = await host.getAttribute('aria-selected');
        const hasSelectedClass = await host.hasClass('ds-bottom-nav-selected');
        return ariaSelected === 'true' || hasSelectedClass;
    }

    async isFocused(): Promise<boolean> {
        const host = await this.host();
        return host.hasClass('ds-bottom-nav-focused');
    }

    async select(): Promise<void> {
        const host = await this.host();
        if (!(await this.isDisabled())) {
            return host.click();
        }
    }

    async getDebugInfo(): Promise<string> {
        const host = await this.host();
        const name = await this.getName();
        const isDisabled = await this.isDisabled();
        const isSelected = await this.isSelected();
        const ariaSelected = await host.getAttribute('aria-selected');
        const hasSelectedClass = await host.hasClass('ds-bottom-nav-selected');
        return `Tab "${name}": disabled=${isDisabled}, selected=${isSelected}, aria-selected=${ariaSelected}, has-selected-class=${hasSelectedClass}`;
    }
}

export class DsBottomNavHarness extends ComponentHarness {
    static hostSelector = 'ds-bottom-nav';

    private getTabsLocator = this.locatorForAll(DsBottomNavTabHarness);

    async getTabs(): Promise<DsBottomNavTabHarness[]> {
        return this.getTabsLocator();
    }

    async getTabNames(): Promise<string[]> {
        const tabs = await this.getTabs();
        return Promise.all(tabs.map((tab) => tab.getName()));
    }

    async getSelectedTabName(): Promise<string | null> {
        const tabs = await this.getTabs();
        for (const tab of tabs) {
            if (await tab.isSelected()) {
                return tab.getName();
            }
        }
        return null;
    }

    async getFocusedTabName(): Promise<string | null> {
        const tabs = await this.getTabs();
        for (const tab of tabs) {
            if (await tab.isFocused()) {
                return tab.getName();
            }
        }
        return null;
    }

    async selectTab(name: string): Promise<void> {
        const tabs = await this.getTabs();
        for (const tab of tabs) {
            if ((await tab.getName()) === name) {
                return tab.select();
            }
        }
        throw new Error(`Tab with name "${name}" not found`);
    }

    async getTabByName(name: string): Promise<DsBottomNavTabHarness> {
        const tabs = await this.getTabs();
        for (const tab of tabs) {
            if ((await tab.getName()) === name) {
                return tab;
            }
        }
        throw new Error(`Tab with name "${name}" not found`);
    }

    async getDebugInfo(): Promise<string[]> {
        const tabs = await this.getTabs();
        return Promise.all(tabs.map((tab) => tab.getDebugInfo()));
    }
}
