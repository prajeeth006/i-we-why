import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import { MenuContentItem } from '@frontend/vanilla/core';

import { DropDownHeaderContent } from '../dropdown-header.client-config';
import { DropDownHeaderService } from '../dropdown-header.service';

/**
 * @stable
 */
@Component({
    standalone: true,
    imports: [CommonModule],
    selector: 'vn-dropdown-header-menu',
    templateUrl: 'dropdown-header-menu.html',
})
export class DropDownHeaderMenuComponent {
    @Input() item: MenuContentItem;
    expanded: boolean = false;

    constructor(
        public content: DropDownHeaderContent,
        private dropDownHeaderService: DropDownHeaderService,
    ) {}

    menuClick(expanded: boolean) {
        this.expanded = expanded;
        this.dropDownHeaderService.toggleMenu(expanded);
    }
}
