import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { MenuDisplayMode } from '@frontend/vanilla/core';
import { BadgeType, MenuItemComponent } from '@frontend/vanilla/features/menus';

import { HeaderItemBase } from '../header-item-base';
import { HeaderConfig } from '../header.client-config';
import { NavigationPillService } from './navigation-pill.service';

@Component({
    standalone: true,
    imports: [CommonModule, MenuItemComponent],
    selector: 'vn-h-navigation-pills',
    templateUrl: 'navigation-pill.html',
})
export class NavigationPillComponent extends HeaderItemBase {
    BadgeType = BadgeType;
    MenuDisplayMode = MenuDisplayMode;

    constructor(
        public content: HeaderConfig,
        public navigationPillService: NavigationPillService,
    ) {
        super();
    }
}
