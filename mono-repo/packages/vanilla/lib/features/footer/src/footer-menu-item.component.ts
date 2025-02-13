import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import { MenuContentItem, MenuSection } from '@frontend/vanilla/core';
import { MenuItemComponent } from '@frontend/vanilla/features/menus';

@Component({
    standalone: true,
    imports: [MenuItemComponent, CommonModule],
    selector: 'vn-footer-menu-item',
    templateUrl: 'footer-menu-item.html',
})
export class FooterMenuItemComponent {
    @Input() item: MenuContentItem;

    MenuSection = MenuSection;
}
