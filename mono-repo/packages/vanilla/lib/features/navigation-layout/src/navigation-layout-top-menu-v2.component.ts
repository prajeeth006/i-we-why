import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { TimerService } from '@frontend/vanilla/core';

import { NavigationLayoutTopMenuBaseComponent } from './navigation-layout-top-menu-base.component';

/**
 * @stable
 */
@Component({
    standalone: true,
    imports: [CommonModule],
    selector: 'lh-navigation-layout-top-menu-v2',
    templateUrl: 'navigation-layout-top-menu-v2.html',
})
export class NavigationLayoutTopMenuV2Component extends NavigationLayoutTopMenuBaseComponent {
    constructor(timerService: TimerService) {
        super(timerService);
    }
}
