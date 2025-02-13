import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { MenuItemComponent } from '@frontend/vanilla/features/menus';

import { HeaderItemBase } from '../header-item-base';

@Component({
    standalone: true,
    imports: [CommonModule, MenuItemComponent],
    selector: 'vn-h-button',
    templateUrl: 'button.html',
})
export class ButtonComponent extends HeaderItemBase {
    constructor() {
        super();
    }
}
