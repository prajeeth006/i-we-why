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
import { LabelSwitcherService } from '@frontend/vanilla/features/label-switcher';
import { MenuItemComponent } from '@frontend/vanilla/features/menus';

@Component({
    standalone: true,
    imports: [CommonModule, MenuItemComponent],
    selector: 'vn-newvisitor-labelswitcher',
    templateUrl: 'newvisitor-page-labelswitcher.html',
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
        return this.pageConfig.htmlSourceTypeReplace ? UtilsService.indexableTypeContainsKey(this.pageConfig.htmlSourceTypeReplace, 'login') : false;
    }
    processClick(event: Event, item: MenuContentItem) {
        this.cookieService.put(CookieName.NewVisitorPageOpted, '1');
        this.menuActionsService.processClick(event, item, MenuActionOrigin.Misc, false);
    }
}
