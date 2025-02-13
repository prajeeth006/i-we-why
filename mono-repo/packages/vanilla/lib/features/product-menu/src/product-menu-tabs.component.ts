import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';

import { MenuContentItem, MenuDisplayMode, MenuSection, trackByProp } from '@frontend/vanilla/core';
import { MenuItemComponent } from '@frontend/vanilla/features/menus';
import { ProductMenuService } from '@frontend/vanilla/shared/product-menu';

@Component({
    standalone: true,
    imports: [CommonModule, MenuItemComponent],
    selector: 'vn-product-menu-tabs',
    templateUrl: 'product-menu-tabs.html',
})
export class ProductMenuTabsComponent {
    productMenuService = inject(ProductMenuService);
    @Input() useFastIconType: boolean;
    trackByText = trackByProp<MenuContentItem>('text');
    MenuSection = MenuSection;

    onClick(item: MenuContentItem) {
        if (item.layout) {
            this.productMenuService.openTab(item.name);
        } else if (!this.productMenuService.routerMode) {
            this.productMenuService.toggle(false);
        }
    }
    findDisplayMode(useFastSvg: boolean): MenuDisplayMode {
        return useFastSvg ? MenuDisplayMode.FastIcon : MenuDisplayMode.Icon;
    }
}
