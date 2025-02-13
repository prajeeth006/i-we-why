import { Injectable } from '@angular/core';

import { OnFeatureInit, SofStatusDetailsCoreService } from '@frontend/vanilla/core';

import { SofStatusDetailsService } from './sof-status-details.service';

@Injectable({
    providedIn: 'root',
})
export class SofStatusDetailsBootstrapService implements OnFeatureInit {
    constructor(
        private sofStatusDetailsCoreService: SofStatusDetailsCoreService,
        private sofStatusDetailsService: SofStatusDetailsService,
    ) {}

    onFeatureInit() {
        this.sofStatusDetailsCoreService.set(this.sofStatusDetailsService);
    }
}
