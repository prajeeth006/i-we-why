import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { MenuItemComponent } from '@frontend/vanilla/features/menus';

import { BottomSheetItemBase } from '../bottom-sheet-item-base';

@Component({
    standalone: true,
    imports: [CommonModule, MenuItemComponent],
    selector: 'vn-bs-link',
    templateUrl: 'link.html',
})
export class LinkComponent extends BottomSheetItemBase {
    constructor() {
        super();
    }
}
