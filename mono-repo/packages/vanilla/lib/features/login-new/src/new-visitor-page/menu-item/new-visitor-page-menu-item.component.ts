import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import { CookieName, CookieService, MenuActionOrigin, MenuActionsService, MenuContentItem, MenuSection } from '@frontend/vanilla/core';
import { MenuItemComponent } from '@frontend/vanilla/features/menus';

@Component({
    standalone: true,
    imports: [CommonModule, MenuItemComponent],
    selector: 'vn-nv-menu-item',
    templateUrl: 'new-visitor-page-menu-item.html',
})
export class NewVisitorPageMenuItemComponent {
    @Input() item: MenuContentItem;

    MenuSection = MenuSection;

    constructor(
        private menuActionsService: MenuActionsService,
        private cookieService: CookieService,
    ) {}

    processClick(event: Event, item: MenuContentItem) {
        this.saveOptionSelectedCookie();
        this.menuActionsService.processClick(event, item, MenuActionOrigin.Misc, false);
    }

    saveOptionSelectedCookie() {
        this.cookieService.put(CookieName.NewVisitorPageOpted, '1');
    }
}
