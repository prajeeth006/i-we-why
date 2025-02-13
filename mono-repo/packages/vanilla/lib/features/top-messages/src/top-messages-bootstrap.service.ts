import { Injectable } from '@angular/core';

import { DynamicLayoutService, OnFeatureInit, SlotName } from '@frontend/vanilla/core';

import { TopMessagesComponent } from './top-messages.component';

@Injectable()
export class TopMessagesBootstrapService implements OnFeatureInit {
    constructor(private dynamicLayoutService: DynamicLayoutService) {}

    onFeatureInit() {
        this.dynamicLayoutService.addFirstComponent(SlotName.Messages, TopMessagesComponent, null);
    }
}
