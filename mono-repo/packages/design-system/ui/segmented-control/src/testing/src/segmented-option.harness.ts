import { BaseHarnessFilters, ComponentHarness, ComponentHarnessConstructor, HarnessPredicate } from '@angular/cdk/testing';

export type DsSegmentedOptionHarnessFilters = {
    text?: string | RegExp | null;
    name?: string | RegExp | null;
    selected?: boolean;
} & BaseHarnessFilters;

export class DsSegmentedOptionHarness extends ComponentHarness {
    static hostSelector = '.ds-segment-item';

    static with<T extends DsSegmentedOptionHarness>(
        this: ComponentHarnessConstructor<T>,
        options: DsSegmentedOptionHarnessFilters,
    ): HarnessPredicate<T> {
        return new HarnessPredicate(this, options)
            .addOption('text', options.text, (harness, text) => HarnessPredicate.stringMatches(harness.getText(), text))
            .addOption('name', options.name, async (harness, name) => {
                const harnessName = await harness.getName();
                return HarnessPredicate.stringMatches(harnessName, name);
            })
            .addOption('selected', options.selected, async (harness, selected) => (await harness.isSelected()) === selected);
    }

    async getText(): Promise<string> {
        return (await this.host()).text();
    }

    async isSelected(): Promise<boolean> {
        const hostEl = await this.host();
        return (await hostEl.getAttribute('aria-selected')) === 'true';
    }

    async isChecked(): Promise<boolean> {
        const hostEl = await this.host();
        return (await hostEl.getAttribute('aria-checked')) === 'true';
    }

    async getName(): Promise<string> {
        const nameAttr = await (await this.host()).getAttribute('name');
        return nameAttr ?? '';
    }

    /** Selects the given tab by clicking on the label. Tab cannot be selected if disabled. */
    async select(): Promise<void> {
        await (await this.host()).click('center');
    }
}
