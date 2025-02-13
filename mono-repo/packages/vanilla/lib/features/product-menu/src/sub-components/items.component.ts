import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { DynamicComponentDirective } from '@frontend/vanilla/core';

import { ProductMenuItemBase } from './product-menu-item-base';

@Component({
    standalone: true,
    imports: [CommonModule, DynamicComponentDirective],
    selector: 'vn-pm-items',
    templateUrl: 'items.html',
})
export class ItemsComponent extends ProductMenuItemBase {
    constructor() {
        super();
    }
}
