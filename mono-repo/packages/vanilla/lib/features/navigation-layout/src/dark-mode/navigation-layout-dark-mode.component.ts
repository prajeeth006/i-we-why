import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { TrackingService } from '@frontend/vanilla/core';

import { NavigationLayoutPageComponent } from '../navigation-layout-page.component';
import { DarkModeComponent } from './dark-mode.component';

/**
 * @stable
 */
@Component({
    standalone: true,
    imports: [CommonModule, DarkModeComponent, NavigationLayoutPageComponent],
    selector: 'lh-navigation-layout-dark-mode',
    templateUrl: 'navigation-layout-dark-mode.component.html',
})
export class NavigationLayoutDarkModeComponent {
    constructor(private trackingService: TrackingService) {}

    track(enabled: boolean) {
        this.trackingService.triggerEvent('Event.Tracking', {
            'component.CategoryEvent': 'Night Mode',
            'component.LabelEvent': 'Night Mode Settings Page',
            'component.ActionEvent': `Turn Night Mode: ${enabled ? 'ON' : 'OFF'}`,
            'component.PositionEvent': 'not applicable',
            'component.LocationEvent': 'Settings Page',
            'component.EventDetails': 'not applicable',
            'component.URLClicked': 'not applicable',
        });
    }
}
