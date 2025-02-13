import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';

import { MenuContentItem, MenuDisplayMode, MenuSection, trackByProp } from '@frontend/vanilla/core';
import { MenuItemComponent } from '@frontend/vanilla/features/menus';
import { ProductMenuConfig, ProductMenuService } from '@frontend/vanilla/shared/product-menu';

@Component({
    standalone: true,
    imports: [CommonModule, MenuItemComponent],
    selector: 'vn-product-menu-apps',
    templateUrl: 'product-menu-apps.html',
})
export class ProductMenuAppsComponent {
    config = inject(ProductMenuConfig);
    @Input() useFastIconType: boolean;
    productMenuService = inject(ProductMenuService);
    MenuDisplayMode = MenuDisplayMode;
    MenuSection = MenuSection;
    trackByText = trackByProp<MenuContentItem>('text');
}
