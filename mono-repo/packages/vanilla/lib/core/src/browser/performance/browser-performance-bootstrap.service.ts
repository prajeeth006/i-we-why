import { Injectable } from '@angular/core';

import { OnAppInit } from '../../bootstrap/bootstrapper.service';
import { BrowserPerformanceService } from './browser-performance.service';

/**
 * @whatItDoes Initializes the browser performance API.
 *
 * @stable
 */
@Injectable()
export class BrowserPerformanceBootstrapService implements OnAppInit {
    constructor(private service: BrowserPerformanceService) {}

    onAppInit() {
        // BrowserPerformanceService is initialized here explicitly, in order to improve consistency instead of wiring it up using the load event handler.
        this.service.init();
    }
}
