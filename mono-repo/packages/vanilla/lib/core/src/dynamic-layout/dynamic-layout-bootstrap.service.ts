import { Injectable } from '@angular/core';

import { OnAppInit } from '../bootstrap/bootstrapper.service';
import { MainComponent } from '../main/main.component';
import { DynamicLayoutService, SlotName, SlotType } from './dynamic-layout.service';

@Injectable()
export class DynamicLayoutBootstrapService implements OnAppInit {
    constructor(private dynamicLayoutService: DynamicLayoutService) {}

    onAppInit() {
        // Slots registered in Vanilla
        this.dynamicLayoutService.registerSlot(SlotName.App, SlotType.Multi);
        this.dynamicLayoutService.registerSlot(SlotName.Background, SlotType.Single);
        this.dynamicLayoutService.registerSlot(SlotName.Banner, SlotType.Single);
        this.dynamicLayoutService.registerSlot(SlotName.Bottom, SlotType.Multi);
        this.dynamicLayoutService.registerSlot(SlotName.Footer, SlotType.Single);
        this.dynamicLayoutService.registerSlot(SlotName.FooterItems, SlotType.Multi);
        this.dynamicLayoutService.registerSlot(SlotName.FooterItemsInline, SlotType.Multi);
        this.dynamicLayoutService.registerSlot(SlotName.Header, SlotType.Single);
        this.dynamicLayoutService.registerSlot(SlotName.HeaderBottomItems, SlotType.Multi);
        this.dynamicLayoutService.registerSlot(SlotName.HeaderSubNav, SlotType.Single);
        this.dynamicLayoutService.registerSlot(SlotName.HeaderTopItems, SlotType.Multi);
        this.dynamicLayoutService.registerSlot(SlotName.LoginSpinner, SlotType.Single);
        this.dynamicLayoutService.registerSlot(SlotName.Main, SlotType.Single);
        this.dynamicLayoutService.registerSlot(SlotName.Menu, SlotType.Single);
        this.dynamicLayoutService.registerSlot(SlotName.Messages, SlotType.Multi);
        this.dynamicLayoutService.registerSlot(SlotName.NavLayoutFooter, SlotType.Single);

        this.dynamicLayoutService.setComponent(SlotName.Main, MainComponent);
    }
}
