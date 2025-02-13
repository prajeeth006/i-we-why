import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { MenuContentItem, trackByProp } from '@frontend/vanilla/core';
import { DslPipe } from '@frontend/vanilla/shared/browser';

import { DropDownHeaderContent } from './dropdown-header.client-config';
import { DropDownHeaderItemComponent } from './sub-components/dropdown-header-item.component';
import { DropDownHeaderProductsComponent } from './sub-components/dropdown-header-products.component';
import { DropDownHeaderSectionComponent } from './sub-components/dropdown-header-section.component';

/**
 * @stable
 */
@Component({
    standalone: true,
    imports: [DslPipe, DropDownHeaderItemComponent, DropDownHeaderSectionComponent, DropDownHeaderProductsComponent, CommonModule],
    selector: 'vn-dropdown-header',
    templateUrl: 'dropdown-header.component.html',
})
export class DropDownHeaderComponent {
    readonly trackByText = trackByProp<MenuContentItem>('text');
    constructor(public content: DropDownHeaderContent) {}
}
