import { BaseHarnessFilters, ComponentHarness, ComponentHarnessConstructor, HarnessPredicate } from '@angular/cdk/testing';

export interface DsSearchHarnessFilters extends BaseHarnessFilters {
    /** Only find instances whose clear search aria label matches the given value **/
    placeholder?: string | RegExp;
}

export class DsSearchInputHarness extends ComponentHarness {
    static hostSelector = '[dsSearchInput]';

    /** Whether the search input is focused. */
    async isFocused(): Promise<boolean> {
        return (await this.host()).isFocused();
    }

    /** Focuses the search input and returns a void promise that indicates when the action is complete. */
    async focus(): Promise<void> {
        return (await this.host()).focus();
    }

    /** Blurs the search input and returns a void promise that indicates when the action is complete. */
    async blur(): Promise<void> {
        return (await this.host()).blur();
    }

    async setValue(text: string): Promise<void> {
        return await (await this.host()).setInputValue(text);
    }

    async getValue(): Promise<string> {
        return await (await this.host()).getProperty('value');
    }
}

export class DsSearchHarness extends ComponentHarness {
    static hostSelector = 'ds-search-bar';

    private containerEl = this.locatorFor('.ds-search-bar');
    private clearIconEl = this.locatorFor('.ds-search-bar-close');
    private searchIconEl = this.locatorFor('.ds-search-bar-icon');
    private searchInputComponentHarness = this.locatorFor(DsSearchInputHarness); //

    static with<T extends DsSearchHarness>(this: ComponentHarnessConstructor<T>, options: DsSearchHarnessFilters = {}): HarnessPredicate<T> {
        return new HarnessPredicate(this, options).addOption('placeholder', options.placeholder, (harness, placeholder) =>
            HarnessPredicate.stringMatches(harness.getClearSearchAttribute(), placeholder),
        );
    }

    async getClearSearchAttribute() {
        const hostEl = await this.host();
        return await hostEl.getAttribute('placeholder');
    }

    async getClearSearchIconElement() {
        return this.clearIconEl();
    }

    async getSearchIconElement() {
        return this.searchIconEl();
    }

    async getSearchInput() {
        return this.searchInputComponentHarness();
    }

    /** Whether the search is focused. */
    async isFocused(): Promise<boolean> {
        return (await this.host()).isFocused();
    }

    /** Whether the search input is focused. */
    async isInputFocused(): Promise<boolean> {
        return (await this.getSearchInput()).isFocused();
    }

    /** Click on the container element **/
    async click() {
        return (await this.containerEl()).click();
    }

    /** Gets a boolean promise indicating if the search is disabled. */
    async isDisabled(): Promise<boolean> {
        return (await (await this.containerEl()).getAttribute('class'))?.split(' ').includes('disabled') ?? false;
    }

    /** Gets a boolean promise indicating if the searchbar is inversed. */
    async isInverse(): Promise<boolean> {
        const host = await this.host();
        return await host.hasClass('ds-search-bar-inverse');
    }

    /** Retrieves the value of the role attribute */
    async getRole(): Promise<string | null> {
        return (await this.containerEl()).getAttribute('role');
    }

    /** Retrieves the value of the aria-label attribute */
    async getAriaLabel(): Promise<string | null> {
        return (await this.containerEl()).getAttribute('aria-label');
    }
}
