import { CommonModule } from '@angular/common';
import { Component, Type, ViewEncapsulation } from '@angular/core';

import { DynamicComponentDirective, MenuContentItem, trackByProp } from '@frontend/vanilla/core';
import { DslPipe } from '@frontend/vanilla/shared/browser';

import { BottomSheetConfig } from './bottom-sheet.client-config';
import { BottomSheetService } from './bottom-sheet.service';

@Component({
    standalone: true,
    imports: [CommonModule, DynamicComponentDirective, DslPipe],
    selector: 'vn-bottom-sheet-menu',
    templateUrl: 'bottom-sheet-menu.html',
    styleUrls: ['../../../../../themepark/themes/whitelabel/components/bottom-sheet/styles.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class BottomSheetMenuComponent {
    readonly trackByText = trackByProp<MenuContentItem>('text');

    constructor(
        public content: BottomSheetConfig,
        private bottomSheetService: BottomSheetService,
    ) {}

    getItemComponent(type: string): Type<any> | null {
        return this.bottomSheetService.getBottomSheetComponent(type);
    }
}
