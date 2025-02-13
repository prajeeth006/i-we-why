import { ComponentHarness } from '@angular/cdk/testing';

export class DsCardContentHarness extends ComponentHarness {
    static hostSelector = 'ds-card-content';

    /** Method to get the applied classes from the host element */
    async getHostClasses(): Promise<string | null> {
        return (await this.host()).getAttribute('class');
    }

    /** Checks content text. **/
    async getText(): Promise<string> {
        return (await this.host()).text();
    }
}
