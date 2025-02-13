import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';

import {
    CookieName,
    CookieService,
    MenuActionOrigin,
    MenuActionsService,
    MenuContentItem,
    MenuSection,
    PERMANENT_COOKIE_EXPIRATION,
    Page,
    UtilsService,
} from '@frontend/vanilla/core';
import { LabelSwitcherService } from '@frontend/vanilla/features/label-switcher';
import { MenuItemComponent } from '@frontend/vanilla/features/menus';

@Component({
    standalone: true,
    imports: [CommonModule, MenuItemComponent, MenuItemComponent],
    selector: 'vn-new-visitor-label-switcher',
    templateUrl: 'new-visitor-page-label-switcher.html',
})
export class NewVisitorLabelSwitcherComponent {
    @Input() item: MenuContentItem;

    MenuSection = MenuSection;
    private pageConfig = inject(Page);
    constructor(
        public labelSwitcherService: LabelSwitcherService,
        private menuActionsService: MenuActionsService,
        private cookieService: CookieService,
    ) {}
    get useFastIconType(): boolean {
        return this.pageConfig.htmlSourceTypeReplace
            ? UtilsService.indexableTypeContainsKey(this.pageConfig.htmlSourceTypeReplace, 'login-new')
            : false;
    }

    processClick(event: Event, item: MenuContentItem) {
        this.cookieService.putRaw(CookieName.NewVisitorPageOpted, '1', { expires: PERMANENT_COOKIE_EXPIRATION });
        this.menuActionsService.processClick(event, item, MenuActionOrigin.Misc, false);
    }
}
