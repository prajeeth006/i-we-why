import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, HostBinding, OnDestroy } from '@angular/core';

import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { VanillaElements } from '../browser/browser.models';
import { ElementKeyDirective } from '../browser/element-key.directive';
import { HtmlNode } from '../browser/html-node.service';
import { DynamicLayoutSlotComponent } from '../dynamic-layout/dynamic-layout-slot.component';
import { SlotName, SlotType } from '../dynamic-layout/dynamic-layout.service';
import { LoadingIndicatorComponent } from '../loading-indicator/loading-indicator.component';
import { EventsService, SimpleEvent, VanillaEventNames } from '../utils/events.service';

@Component({
    standalone: true,
    imports: [CommonModule, LoadingIndicatorComponent, DynamicLayoutSlotComponent, ElementKeyDirective],
    selector: 'vn-app',
    templateUrl: 'app.html',
})
export class AppComponent implements AfterViewInit, OnDestroy {
    @HostBinding('attr.class') get class(): string {
        return 'app-root';
    }

    SlotName = SlotName;
    SlotType = SlotType;
    VanillaElements = VanillaElements;

    private unsubscribe = new Subject();
    constructor(
        private htmlNode: HtmlNode,
        private eventsService: EventsService,
    ) {}

    ngAfterViewInit() {
        this.htmlNode.setCssClass('ready header-shown', true);

        this.eventsService.allEvents
            .pipe(
                takeUntil(this.unsubscribe),
                filter(
                    (e: SimpleEvent) => e?.eventName === VanillaEventNames.FeatureEnabledStatus && e.data.id == 'header' && e.data.enabled === false,
                ),
            )
            .subscribe(() => {
                this.htmlNode.toggleVisibilityClass('header', false);
            });
    }

    ngOnDestroy() {
        this.unsubscribe.next(null);
        this.unsubscribe.complete();
    }
}
