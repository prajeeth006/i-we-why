import { Injectable } from '@angular/core';

import { OnFeatureInit, ToastrQueueService, ToastrType } from '@frontend/vanilla/core';

@Injectable()
export class UntestedBrowserBootstrapService implements OnFeatureInit {
    constructor(private toastrQueueService: ToastrQueueService) {}

    onFeatureInit() {
        this.toastrQueueService.add(ToastrType.UpdateBrowser);
    }
}
