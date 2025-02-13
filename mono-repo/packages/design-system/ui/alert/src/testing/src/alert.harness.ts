import { ComponentHarness } from '@angular/cdk/testing';

export class DsAlertHarness extends ComponentHarness {
    static hostSelector = 'ds-alert';

    private headerText = this.locatorFor('[slot=header]');

    /** Gets a promise for the alert's Header. */
    async getHeaderText(): Promise<string> {
        const textElement = await this.headerText();
        return textElement.text();
    }

    async getContent(): Promise<string> {
        const textElement = await this.host();
        return textElement.text();
    }

    /** Checks if the status icon is present. */
    async getStatusIcon(): Promise<boolean> {
        const host = await this.host();
        return await host.hasClass('ds-alert-icons-container');
    }

    /** Gets a boolean promise indicating if the alert is inversed. */
    async isInverse(): Promise<boolean> {
        const host = await this.host();
        return await host.hasClass('ds-alert-inverse');
    }
}
