import { Injectable } from '@angular/core';

import { OnAppInit } from '../bootstrap/bootstrapper.service';
import { ScrollbarEnableService } from './scrollbar-enable.service';

@Injectable()
export class DsIntegrationBootstrapService implements OnAppInit {
    constructor(private scrollbarService: ScrollbarEnableService) {}
    onAppInit() {
        this.scrollbarService.enable();
    }
}
