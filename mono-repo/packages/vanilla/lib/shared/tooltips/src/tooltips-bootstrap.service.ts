import { Injectable } from '@angular/core';

import { firstValueFrom } from 'rxjs';

import { TooltipsConfig } from './tooltips.client-config';

@Injectable({
    providedIn: 'root',
})
export class TooltipsBootstrapService {
    constructor(private config: TooltipsConfig) {}

    async onFeatureInit() {
        await firstValueFrom(this.config.whenReady);
    }
}
