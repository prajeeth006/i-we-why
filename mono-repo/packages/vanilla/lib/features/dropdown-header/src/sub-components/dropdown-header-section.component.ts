import { CommonModule } from '@angular/common';
import { Component, Input, Type } from '@angular/core';

import { DynamicComponentDirective, MenuContentItem, trackByProp } from '@frontend/vanilla/core';
import { DslPipe } from '@frontend/vanilla/shared/browser';

import { DropDownHeaderService } from '../dropdown-header.service';

/**
 * @stable
 */
@Component({
    standalone: true,
    imports: [CommonModule, DynamicComponentDirective, DslPipe],
    selector: 'vn-dropdown-header-section',
    templateUrl: 'dropdown-header-section.html',
})
export class DropDownHeaderSectionComponent {
    @Input() items: MenuContentItem[];
    readonly trackByText = trackByProp<MenuContentItem>('text');
    constructor(private dropDownHeaderService: DropDownHeaderService) {}

    getItemComponent(type: string): Type<any> | null {
        return this.dropDownHeaderService.getDropDownHeaderComponent(type);
    }
}
