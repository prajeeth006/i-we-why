import { Directive, Input, Type, inject } from '@angular/core';

import { MenuContentItem, MenuDisplayMode, MenuSection, Page, UtilsService, trackByProp } from '@frontend/vanilla/core';
import { ProductMenuService } from '@frontend/vanilla/shared/product-menu';

@Directive()
export class ProductMenuItemBase {
    @Input() item: MenuContentItem;
    readonly trackByText = trackByProp<MenuContentItem>('text');
    MenuSection = MenuSection;
    protected productMenuService = inject(ProductMenuService);
    readonly page = inject(Page);

    get v2() {
        return this.productMenuService.v2;
    }

    get useFastIconType(): boolean {
        return this.page.htmlSourceTypeReplace ? UtilsService.indexableTypeContainsKey(this.page.htmlSourceTypeReplace, 'product-menu') : false;
    }
    getItemComponent(type: string): Type<any> | null {
        return this.productMenuService.getProductMenuComponent(type);
    }

    findDisplayMode(): MenuDisplayMode {
        return this.useFastIconType === true ? MenuDisplayMode.FastIcon : MenuDisplayMode.Icon;
    }
}
