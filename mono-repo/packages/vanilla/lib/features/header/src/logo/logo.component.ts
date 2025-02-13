import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { Page, TrackingService, UserService } from '@frontend/vanilla/core';
import { SvgComponent } from '@frontend/vanilla/features/svg';

import { HeaderItemBase } from '../header-item-base';

@Component({
    standalone: true,
    imports: [CommonModule, SvgComponent],
    selector: 'vn-h-logo',
    templateUrl: 'logo.html',
})
export class LogoComponent extends HeaderItemBase {
    constructor(
        private userService: UserService,
        private page: Page,
        private trackingService: TrackingService,
    ) {
        super();
    }

    click(event: Event) {
        if (!this.userService.isAuthenticated) {
            this.trackingService.triggerEvent('Event.Tracking', {
                'component.CategoryEvent': 'navigation',
                'component.LabelEvent': 'topnav',
                'component.ActionEvent': 'click',
                'component.PositionEvent': this.page.product,
                'component.LocationEvent': this.item.name,
                'component.EventDetails': 'logo',
                'component.URLClicked': this.page.homePage,
            });
        }
        this.processClick(event);
    }
}
