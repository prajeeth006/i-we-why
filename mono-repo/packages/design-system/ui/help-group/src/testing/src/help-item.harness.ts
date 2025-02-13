import { BaseHarnessFilters, ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';

import { DS_HELP_GROUP_TYPE_ARRAY, DsHelpGroupType } from '@frontend/ui/help-group';

export type DsHelpItemFilters = {
    /** Only find instances whose size matches the given type. */
    type?: DsHelpGroupType;

    isRightAligned?: boolean;

    /** Only find instances which match the given inverse state. */
    inverse?: boolean;

    /** Only find instances which match the given text. */
    text?: string;
} & BaseHarnessFilters;

export class DsHelpItemHarness extends ComponentHarness {
    static hostSelector = 'ds-help-item';

    private iconEl = this.locatorFor('.ds-help-item-icon');
    private textEl = this.locatorFor('.ds-help-item-text');

    // Factory method for creating an Accordion Harness with specific filters.
    static with(options: DsHelpItemFilters): HarnessPredicate<DsHelpItemHarness> {
        return new HarnessPredicate(DsHelpItemHarness, options)
            .addOption('type', options.type, (harness, type) => harness.hasType(type))
            .addOption('isRightAligned', options.isRightAligned, (harness, isRightAligned) => harness.hasInputType(isRightAligned))
            .addOption('inverse', options.inverse, async (harness, inverse) => (await harness.isInverse()) === inverse)
            .addOption('text', options.text, async (harness, text) => HarnessPredicate.stringMatches(harness.getTextContent(), text));
    }

    async getTextContent(): Promise<string> {
        const textElement = await this.textEl();
        return textElement.text();
    }

    async hasIcon(): Promise<boolean> {
        const el = await this.iconEl();
        return el != null;
    }

    async getType(): Promise<string> {
        const host = await this.host();
        const classList = await host.getAttribute('class');
        return DS_HELP_GROUP_TYPE_ARRAY.find((type) => classList?.includes(`ds-help-item-${type}`)) || 'success';
    }

    /** Method to get the applied classes from the host element */
    async getHostClasses(): Promise<string | null> {
        return (await this.host()).getAttribute('class');
    }

    /** Checks if a specific type is applied. **/
    async hasType(type: DsHelpGroupType): Promise<boolean> {
        const classList = (await this.getHostClasses())?.split(' ');
        return classList?.includes(`ds-help-item-${type}`) ?? false;
    }

    /** Checks if a specific inputType is applied. **/
    async hasInputType(isRightAligned: boolean): Promise<boolean> {
        const classList = (await this.getHostClasses())?.split(' ');
        return classList?.includes(`${isRightAligned ? 'ds-help-item-right-alignment' : ''}`) ?? false;
    }

    /** Gets a boolean promise indicating if the help group is inversed. */
    async isInverse(): Promise<boolean> {
        const host = await this.host();
        return await host.hasClass('ds-help-item-inverse');
    }
}
