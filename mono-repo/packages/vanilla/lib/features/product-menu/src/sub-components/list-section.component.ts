import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { DynamicComponentDirective } from '@frontend/vanilla/core';

import { ProductMenuItemBase } from './product-menu-item-base';

@Component({
    standalone: true,
    imports: [CommonModule, DynamicComponentDirective],
    selector: 'vn-pm-list-section',
    templateUrl: 'list-section.html',
})
export class ListSectionComponent extends ProductMenuItemBase {
    constructor() {
        super();
    }
}
