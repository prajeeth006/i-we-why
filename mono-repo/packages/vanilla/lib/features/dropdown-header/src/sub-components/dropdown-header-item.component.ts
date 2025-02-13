import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import { MenuContentItem, MenuSection } from '@frontend/vanilla/core';
import { MenuItemComponent } from '@frontend/vanilla/features/menus';

@Component({
    standalone: true,
    imports: [CommonModule, MenuItemComponent],
    selector: 'vn-dropdown-header-item',
    templateUrl: 'dropdown-header-item.html',
})
export class DropDownHeaderItemComponent {
    @Input() item: MenuContentItem;

    MenuSection = MenuSection;
}
