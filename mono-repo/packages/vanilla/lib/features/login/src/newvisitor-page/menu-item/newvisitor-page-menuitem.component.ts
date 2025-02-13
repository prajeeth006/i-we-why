import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';

import {
    CookieName,
    CookieService,
    MenuActionOrigin,
    MenuActionsService,
    MenuContentItem,
    MenuSection,
    Page,
    UtilsService,
} from '@frontend/vanilla/core';
import { MenuItemComponent } from '@frontend/vanilla/features/menus';

@Component({
    standalone: true,
    imports: [CommonModule, MenuItemComponent],
    selector: 'vn-nv-menu-item',
    templateUrl: 'newvisitor-page-menuitem.html',
})
export class NewVisitorPageMenuItemComponent {
    @Input() item: MenuContentItem;

    MenuSection = MenuSection;
    private pageConfig = inject(Page);
    get useFastIconType(): boolean {
        return this.pageConfig.htmlSourceTypeReplace ? UtilsService.indexableTypeContainsKey(this.pageConfig.htmlSourceTypeReplace, 'login') : false;
    }
    constructor(
        private menuActionsService: MenuActionsService,
        private cookieService: CookieService,
    ) {}

    processClick(event: Event, item: MenuContentItem) {
        this.cookieService.put(CookieName.NewVisitorPageOpted, '1');
        this.menuActionsService.processClick(event, item, MenuActionOrigin.Misc, false);
    }
}
