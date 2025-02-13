import { CommonModule } from '@angular/common';
import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

import { first } from 'rxjs/operators';

import { DslPipe } from '../browser/dsl.pipe';
import { Page } from '../client-config/page.client-config';
import { ViewTemplate } from '../content/content.models';
import { DslService } from '../dsl/dsl.service';
import { EventsService, VanillaEventNames } from '../utils/events.service';
import { DynamicComponentDirective } from './dynamic-component.directive';
import { DynamicHtmlDirective } from './dynamic-html.directive';
import { DynamicLayoutConfig } from './dynamic-layout.client-config';
import { DynamicLayoutService, MultiSlot, SingleSlot, SlotName, SlotType } from './dynamic-layout.service';

/**
 * @stable
 *
 * @howToUse
 *
 * ```
 * <vn-dynamic-layout-slot [slot]="'slotName'" [type]="SlotType" [cssClass]="'...'" />
 * ```
 *
 * @description
 *
 * You can configure the slot in DynaCon: {@link https://admin.dynacon.prod.env.works/services/198137/features/370176/keys/370351/valuematrix?_matchAncestors=true}.
 */
@Component({
    standalone: true,
    imports: [CommonModule, DynamicComponentDirective, DynamicHtmlDirective, DslPipe],
    selector: 'vn-dynamic-layout-slot',
    templateUrl: 'dynamic-layout-slot.html',
})
export class DynamicLayoutSlotComponent implements OnInit {
    @Input() slot: string;
    @Input() cssClass?: string = '';

    @HostBinding('attr.class') get class(): string {
        return `slot slot-${this.layoutSlot?.slotType} slot-${this.slot} ${this.cssClass}`.trim();
    }

    @HostBinding('style') get myStyle(): SafeStyle | null {
        return this.getSlotStyle(this.slot);
    }

    SlotType = SlotType;
    templates: ViewTemplate[];
    layoutSlot: any;

    constructor(
        private sanitizer: DomSanitizer,
        private page: Page,
        private config: DynamicLayoutConfig,
        private dynamicLayoutService: DynamicLayoutService,
        private dslService: DslService,
        private eventsService: EventsService,
    ) {}

    ngOnInit() {
        try {
            this.layoutSlot = this.dynamicLayoutService.getSlot<SingleSlot | MultiSlot>(this.slot, SlotType.Any);
            this.layoutSlot.show();
            if (this.slot === SlotName.Footer) {
                this.eventsService.raise({ eventName: VanillaEventNames.FooterSlotLoaded });
            }
        } catch (_) {
            /**
             * Slots configured in DynaCon
             * See: {@link https://admin.dynacon.prod.env.works/services/198137/features/370176/keys/370351/valuematrix?_matchAncestors=true}.
             */
            this.config.whenReady.pipe(first()).subscribe(() => {
                const slotConfig = this.config.slots[this.slot];

                if (slotConfig) {
                    this.dynamicLayoutService.registerSlot(this.slot, slotConfig.type);

                    this.layoutSlot = this.dynamicLayoutService.getSlot<SingleSlot | MultiSlot>(this.slot, slotConfig?.type || SlotType.Any);
                    this.templates = (slotConfig.content as any)[0]?.items || slotConfig.content;

                    this.dslService.evaluateExpression<boolean>(slotConfig.isEnabledCondition).subscribe((isEnabled: boolean) => {
                        if (isEnabled) {
                            this.layoutSlot.show();
                        } else {
                            this.layoutSlot.hide();
                        }
                    });
                }
            });
        }
    }

    private getSlotStyle(slot: string): SafeStyle | null {
        const slotStyle = this.page.slotStyle[slot];

        if (!slotStyle) {
            return null;
        }

        let styles = '';
        Object.entries(slotStyle).forEach(([key, value]) => (styles += `${key}:${value};`));

        return this.sanitizer.bypassSecurityTrustStyle(styles);
    }
}
