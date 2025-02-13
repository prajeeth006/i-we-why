import { BaseHarnessFilters, ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';

export interface TooltipHarnessFilters extends BaseHarnessFilters {
    text?: string | RegExp | null;
}

export class DsTooltipContentHarness extends ComponentHarness {
    static hostSelector = 'ds-tooltip-content';

    static with(options: TooltipHarnessFilters = {}): HarnessPredicate<DsTooltipContentHarness> {
        return new HarnessPredicate(DsTooltipContentHarness, options);
    }

    private getContainerElement = this.documentRootLocatorFactory().locatorForOptional('.ds-tooltip-container');
    private getTitleElement = this.documentRootLocatorFactory().locatorForOptional('[slot=title]');
    private getCloseButtonElement = this.documentRootLocatorFactory().locatorForOptional('.ds-tooltip-close-button');

    async close(): Promise<void> {
        const btn = await this.getCloseButtonElement();
        await btn?.click();
    }

    async getTitle(): Promise<string | null> {
        const titleElement = await this.getTitleElement();
        return titleElement ? titleElement.text() : null;
    }

    async isOpen(): Promise<boolean> {
        const containerElement = await this.getContainerElement();
        return !!containerElement;
    }

    async isClosed(): Promise<boolean> {
        const containerElement = await this.getContainerElement();
        return !!containerElement;
    }
}
