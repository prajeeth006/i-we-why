import { Injectable } from '@angular/core';

import {
    DateTimeService,
    DslService,
    DynamicLayoutService,
    EventsService,
    OnFeatureInit,
    SimpleEvent,
    SingleSlot,
    SlotName,
    SlotType,
    VanillaEventNames,
    ViewTemplateForClient,
} from '@frontend/vanilla/core';
import { CopyrightComponent } from '@frontend/vanilla/shared/copy-right';
import { filter, first, firstValueFrom } from 'rxjs';

import { ResponsiveFooterContent } from './footer.client-config';
import { FooterComponent } from './footer.component';

@Injectable()
export class FooterBootstrapService implements OnFeatureInit {
    constructor(
        private config: ResponsiveFooterContent,
        private dynamicLayoutService: DynamicLayoutService,
        private dslService: DslService,
        private dateTimeService: DateTimeService,
        private eventsService: EventsService,
    ) {}

    async onFeatureInit() {
        await firstValueFrom(this.config.whenReady);

        this.dynamicLayoutService.setComponent(SlotName.Footer, FooterComponent, null);
        this.eventsService.raise({ eventName: VanillaEventNames.FooterLoaded });

        this.eventsService.allEvents
            .pipe(
                filter((e: SimpleEvent) => e?.eventName === VanillaEventNames.FooterSlotLoaded),
                first(),
            )
            .subscribe(() => this.toggleFooter());

        if (this.config.copyright) {
            this.dslService
                .evaluateContent(this.config.copyright)
                .pipe(first())
                .subscribe((item: ViewTemplateForClient) => {
                    if (item?.title) {
                        const copyright = item.title.replace('{year}', this.dateTimeService.now().getFullYear().toString());
                        this.dynamicLayoutService.addComponent(SlotName.FooterItems, CopyrightComponent, { copyright: copyright });
                    }
                });
        }
    }

    toggleFooter() {
        const footerSlot = this.dynamicLayoutService.getSlot<SingleSlot>(SlotName.Footer, SlotType.Single);
        this.dslService.evaluateExpression<boolean>(this.config.isEnabledCondition).subscribe((isEnabled: boolean) => {
            if (isEnabled) {
                footerSlot.show();
            } else {
                footerSlot.hide();
            }
        });
    }
}
