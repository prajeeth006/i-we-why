import { Directive, Input, inject } from '@angular/core';

import {
    MenuActionOrigin,
    MenuActionsService,
    MenuContentItem,
    MenuSection,
    Page,
    UtilsService,
    VanillaElements,
    trackByProp,
} from '@frontend/vanilla/core';

/**
 * A base class for responsive header components registered with {@link HeaderService}.
 *
 * @stable
 */
@Directive()
export abstract class HeaderItemBase {
    @Input() item: MenuContentItem;
    readonly trackByText = trackByProp<MenuContentItem>('text');

    menuActionsService = inject(MenuActionsService);
    MenuSection = MenuSection;
    VanillaElements = VanillaElements;
    private pageConfig = inject(Page);
    get useFastIconType(): boolean {
        return this.pageConfig.htmlSourceTypeReplace ? UtilsService.indexableTypeContainsKey(this.pageConfig.htmlSourceTypeReplace, 'header') : false;
    }

    processClick(event: Event, item?: any) {
        this.menuActionsService.processClick(event, item || this.item, MenuActionOrigin.Header);
    }
}
