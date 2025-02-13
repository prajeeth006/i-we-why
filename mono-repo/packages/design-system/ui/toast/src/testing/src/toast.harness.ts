import { ComponentHarness } from '@angular/cdk/testing';

export class DsToastHarness extends ComponentHarness {
    static hostSelector = 'ds-toast';

    private textEl = this.locatorFor('.ds-toast-description');
    private statusIconEl = this.locatorFor('[slot=statusIcon]');
    private actionButtonEl = this.locatorFor('[slot="action"]');
    private closeIconEl = this.locatorFor('[slot="close"]');

    /** Gets a promise for the toast's description text. */
    async getDescriptionText(): Promise<string> {
        const textElement = await this.textEl();
        return textElement.text();
    }

    /** Checks if the status icon is present. */
    async hasStatusIcon(): Promise<boolean> {
        try {
            await this.statusIconEl();
            return true;
        } catch {
            return false;
        }
    }

    /** Checks if the action button is present. */
    async hasActionButton(): Promise<boolean> {
        try {
            await this.actionButtonEl();
            return true;
        } catch {
            return false;
        }
    }

    /** Checks if the close icon is present. */
    async hasCloseIcon(): Promise<boolean> {
        try {
            await this.closeIconEl();
            return true;
        } catch {
            return false;
        }
    }
}
