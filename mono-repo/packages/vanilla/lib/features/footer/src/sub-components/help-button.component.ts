import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import { MenuContentItem, MenuSection } from '@frontend/vanilla/core';
import { MenuItemComponent } from '@frontend/vanilla/features/menus';

@Component({
    standalone: true,
    imports: [MenuItemComponent, CommonModule],
    selector: 'vn-f-help-button',
    templateUrl: 'help-button.html',
})
export class HelpButtonComponent {
    @Input() item: MenuContentItem | undefined;
    MenuSection = MenuSection;
}
