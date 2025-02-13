import { Injectable } from '@angular/core';

import { DynamicLayoutService, OnFeatureInit, SlotName } from '@frontend/vanilla/core';
import { firstValueFrom } from 'rxjs';

import { DropDownHeaderContent } from './dropdown-header.client-config';
import { DropDownHeaderComponent } from './dropdown-header.component';
import { DropDownHeaderService } from './dropdown-header.service';
import { DropDownHeaderMenuComponent } from './sub-components/dropdown-header-menu.component';

@Injectable()
export class DropDownHeaderBootstrapService implements OnFeatureInit {
    constructor(
        private dynamicLayoutService: DynamicLayoutService,
        public content: DropDownHeaderContent,
        private dropDownHeaderService: DropDownHeaderService,
    ) {}

    async onFeatureInit() {
        await firstValueFrom(this.content.whenReady);

        this.dynamicLayoutService.addComponent(SlotName.HeaderTopItems, DropDownHeaderComponent, null);
        this.dropDownHeaderService.setDropDownHeaderComponent('menu', DropDownHeaderMenuComponent);
    }
}
