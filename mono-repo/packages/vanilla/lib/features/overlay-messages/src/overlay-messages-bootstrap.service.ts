import { Injectable } from '@angular/core';

import { OnFeatureInit } from '@frontend/vanilla/core';

import { OverlayMessagesService } from './overlay-messages.service';

@Injectable()
export class OverlayMessagesBootstrapService implements OnFeatureInit {
    constructor(private overlayMessagesService: OverlayMessagesService) {}

    onFeatureInit() {
        this.overlayMessagesService.showOverlayMessages();
    }
}
