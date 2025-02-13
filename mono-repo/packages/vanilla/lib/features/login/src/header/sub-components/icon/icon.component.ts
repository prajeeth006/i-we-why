import { Component } from '@angular/core';

import { MenuItemComponent } from '@frontend/vanilla/features/menus';

import { LoginItemBase } from '../../../login-item-base';

@Component({
    standalone: true,
    imports: [MenuItemComponent],
    selector: 'vn-l-icon',
    templateUrl: 'icon.html',
})
export class IconComponent extends LoginItemBase {
    constructor() {
        super();
    }
}
