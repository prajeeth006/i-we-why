import { Injectable, inject } from '@angular/core';

import { Page, WINDOW } from '@frontend/vanilla/core';

export interface ScreenTimeRequest {
    startTime: Date;
    screenTime?: Date;
    mac: string;
}

@Injectable()
export class ScreenTimeResourcesService {
    readonly #window = inject(WINDOW);

    constructor(private page: Page) {}

    saveScreenTime(screenTimeRequest: ScreenTimeRequest) {
        const headers = {
            'type': 'application/json',
            'x-bwin-sf-api': this.page.environment,
        };
        const blob = new Blob([JSON.stringify(screenTimeRequest)], headers);

        this.#window.navigator.sendBeacon('/api/screentime/save', blob);
    }
}
