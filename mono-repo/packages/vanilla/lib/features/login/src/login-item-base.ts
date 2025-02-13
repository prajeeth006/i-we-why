import { Directive, Input, inject } from '@angular/core';

import { MenuActionOrigin, MenuActionsService, MenuContentItem, MenuSection, Page, UtilsService } from '@frontend/vanilla/core';

/**
 * A base class for responsive login components registered with {@link LoginService}.
 *
 * @stable
 */
@Directive()
export abstract class LoginItemBase {
    @Input() item: MenuContentItem;

    menuActionsService = inject(MenuActionsService);
    MenuSection = MenuSection;

    processClick(event: Event, item?: any) {
        this.menuActionsService.processClick(event, item || this.item, MenuActionOrigin.Login);
    }
    private pageConfig = inject(Page);
    get useFastIconType(): boolean {
        return this.pageConfig.htmlSourceTypeReplace
            ? UtilsService.indexableTypeContainsKey(this.pageConfig.htmlSourceTypeReplace, 'account-menu')
            : false;
    }
}
