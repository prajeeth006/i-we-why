import { BaseHarnessFilters, ComponentHarness, ComponentHarnessConstructor, HarnessPredicate } from '@angular/cdk/testing';

export type DsTabHarnessFilters = {
    text?: string | RegExp | null;
    disabled?: boolean;
    selected?: boolean;
    variant?: 'horizontal' | 'vertical';
} & BaseHarnessFilters;

export class DsTabHarness extends ComponentHarness {
    static hostSelector = '.ds-tab-header-item';

    static with<T extends DsTabHarness>(this: ComponentHarnessConstructor<T>, options: DsTabHarnessFilters): HarnessPredicate<T> {
        return new HarnessPredicate(this, options)
            .addOption('text', options.text, (harness, text) => HarnessPredicate.stringMatches(harness.getText(), text))
            .addOption('disabled', options.disabled, async (harness, disabled) => (await harness.isDisabled()) === disabled)
            .addOption('variant', options.variant, async (harness, variant) => {
                if (variant === 'horizontal') {
                    return await harness.isHorizontal();
                }
                return await harness.isVertical();
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

    async isVertical(): Promise<boolean> {
        const hostEl = await this.host();
        return await hostEl.hasClass('ds-tab-vertical');
    }

    async isHorizontal(): Promise<boolean> {
        const hostEl = await this.host();
        return await hostEl.hasClass('ds-tab-horizontal');
    }

    async isDisabled(): Promise<boolean> {
        const hostEl = await this.host();
        return (await hostEl.getAttribute('aria-disabled')) === 'true';
    }

    /** Selects the given tab by clicking on the label. Tab cannot be selected if disabled. */
    async select(): Promise<void> {
        await (await this.host()).click('center');
    }
}
