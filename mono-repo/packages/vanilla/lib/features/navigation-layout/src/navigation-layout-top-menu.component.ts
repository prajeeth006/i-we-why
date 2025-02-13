import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';

import { TimerService } from '@frontend/vanilla/core';
import { DslPipe } from '@frontend/vanilla/shared/browser';

import { NavigationLayoutTopMenuBaseComponent } from './navigation-layout-top-menu-base.component';

/**
 * @stable
 */
@Component({
    standalone: true,
    imports: [CommonModule, DslPipe],
    selector: 'lh-navigation-layout-top-menu',
    templateUrl: 'navigation-layout-top-menu.component.html',
    styleUrls: ['../../../../../themepark/themes/whitelabel/components/nav-main/styles.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class NavigationLayoutTopMenuComponent extends NavigationLayoutTopMenuBaseComponent {
    constructor(timerService: TimerService) {
        super(timerService);
    }
}
