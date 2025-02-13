import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { MenuItemComponent } from '@frontend/vanilla/features/menus';

import { BottomSheetItemBase } from '../bottom-sheet-item-base';

@Component({
    standalone: true,
    imports: [CommonModule, MenuItemComponent],
    selector: 'vn-bs-button',
    templateUrl: 'button.html',
})
export class ButtonComponent extends BottomSheetItemBase {
    constructor() {
        super();
    }
}
