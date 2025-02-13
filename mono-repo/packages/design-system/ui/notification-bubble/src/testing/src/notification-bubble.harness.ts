import { BaseHarnessFilters, ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';

import { DsNotificationBubbleSize, DsNotificationBubbleVariant } from '@frontend/ui/notification-bubble';

export type DsNotificationBubbleHarnessFilters = {
    /** Only find instances whose size matches the given value. */
    size?: DsNotificationBubbleSize;

    /** Only find instances whose size matches the given variant. */
    variant?: DsNotificationBubbleVariant;
} & BaseHarnessFilters;

export class DsNotificationBubbleHarness extends ComponentHarness {
    static hostSelector = 'ds-notification-bubble';

    // Factory method for creating a CounterHarness with specific filters.
    static with(options: DsNotificationBubbleHarnessFilters): HarnessPredicate<DsNotificationBubbleHarness> {
        return new HarnessPredicate(DsNotificationBubbleHarness, options)
            .addOption('size', options.size, (harness, size) => harness.hasSize(size))
            .addOption('variant', options.variant, (harness, variant) => harness.hasVariant(variant));
    }

    /** Method to get the applied classes from the host element */
    async getHostClasses(): Promise<string | null> {
        return (await this.host()).getAttribute('class');
    }

    /** Checks if a specific size is applied. **/
    async hasSize(size: DsNotificationBubbleSize): Promise<boolean> {
        const classList = (await this.getHostClasses())?.split(' ');
        return classList?.includes(`ds-notification-bubble-${size}`) ?? false;
    }

    /** Checks if a specific variant is applied. **/
    async hasVariant(variant: DsNotificationBubbleVariant): Promise<boolean> {
        const classList = (await this.getHostClasses())?.split(' ');
        return classList?.includes(`ds-notification-bubble-${variant}`) ?? false;
    }

    /** Gets a boolean promise indicating if the notification-bubble is inversed. */
    async isInverse(): Promise<boolean> {
        const host = await this.host();
        return await host.hasClass('ds-notification-bubble-inverse');
    }
}
