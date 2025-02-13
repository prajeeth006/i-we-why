import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { TrackingService } from '@frontend/vanilla/core';
import { HeaderSearchService } from '@frontend/vanilla/shared/header';

import { HeaderItemBase } from '../header-item-base';

@Component({
    standalone: true,
    imports: [CommonModule],
    selector: 'vn-h-search',
    templateUrl: 'search.html',
})
export class SearchComponent extends HeaderItemBase {
    constructor(
        public service: HeaderSearchService,
        private trackingService: TrackingService,
    ) {
        super();
    }

    click() {
        this.service.click();
        this.trackingService.triggerEvent('Event.NavigationMenus', {
            'page.navigationMenus': 'TopNav_Search',
        });
    }
}
