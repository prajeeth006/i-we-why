import { ComponentHarness } from '@angular/cdk/testing';

export class DsModalHarness extends ComponentHarness {
    static hostSelector = 'ds-modal';

    private headerEl = this.locatorFor('.ds-modal-header');
    private contentEl = this.locatorFor('.ds-modal-content');

    /** Gets a promise for the modal's content text. */
    async getContentText(): Promise<string> {
        const contentElement = await this.contentEl();
        return contentElement.text();
    }

    /** Gets a promise for the modal's header text. */
    async getHeaderText(): Promise<string> {
        const contentElement = await this.headerEl();
        return contentElement.text();
    }
}
