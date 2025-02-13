import { Injectable } from '@angular/core';

import { DsButton, dsButtonProjectableNodes } from '@frontend/ui/button';

import { OnAppInit } from '../bootstrap/bootstrapper.service';
import { EmbeddableComponentsService } from '../dynamic-layout/embeddable-components.service';
import { ButtonBehaviorComponent } from './button-behavior.component';
import { LinkBehaviorComponent } from './link-behavior.component';
import { MenuActionComponent } from './menu-action.component';

@Injectable()
export class PlainLinkBootstrapService implements OnAppInit {
    constructor(private embeddableComponentsService: EmbeddableComponentsService) {}

    onAppInit() {
        this.embeddableComponentsService.registerEmbeddableComponent(DsButton, 5, { projectableNodesMapper: dsButtonProjectableNodes });
        this.embeddableComponentsService.registerEmbeddableComponent(LinkBehaviorComponent, 8);
        this.embeddableComponentsService.registerEmbeddableComponent(MenuActionComponent, 10);
        this.embeddableComponentsService.registerEmbeddableComponent(ButtonBehaviorComponent, 12);
    }
}
