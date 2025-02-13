import { Directive, Input, inject } from '@angular/core';

import { MenuContentItem, MenuDisplayMode, MenuSection, Page, UtilsService } from '@frontend/vanilla/core';

import { BottomSheetOverlayService } from './bottom-sheet-overlay.service';

/** @stable */
@Directive()
export abstract class BottomSheetItemBase {
    @Input() item: MenuContentItem;
    MenuSection = MenuSection;
    protected bottomSheetOverlayService = inject(BottomSheetOverlayService);
    private pageConfig = inject(Page);
    get useFastIconType(): boolean {
        return this.pageConfig.htmlSourceTypeReplace
            ? UtilsService.indexableTypeContainsKey(this.pageConfig.htmlSourceTypeReplace, 'bottom-sheet')
            : false;
    }
    close() {
        this.bottomSheetOverlayService.toggle(false);
    }
    findMenuDisplayMode(): MenuDisplayMode {
        return this.useFastIconType === true ? MenuDisplayMode.FastIcon : MenuDisplayMode.Icon;
    }
}
