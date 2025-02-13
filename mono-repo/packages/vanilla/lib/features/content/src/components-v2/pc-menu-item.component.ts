import { CommonModule } from '@angular/common';
import { Component, Input, Type } from '@angular/core';

import { DynamicComponentDirective, ExpandableMenuItem, MenuActionsService, MenuContentItem, trackByProp } from '@frontend/vanilla/core';
import { IconCustomComponent } from '@frontend/vanilla/features/icons';
import { MenuItemComponent } from '@frontend/vanilla/features/menus';

@Component({
    standalone: true,
    imports: [CommonModule, MenuItemComponent, DynamicComponentDirective, IconCustomComponent],
    selector: 'vn-pc-menu-item',
    templateUrl: 'pc-menu-item.html',
})
export class PCMenuItemComponent {
    @Input() item: ExpandableMenuItem;
    @Input() section: string;
    @Input() level: number = 1;
    type: Type<PCMenuItemComponent> = PCMenuItemComponent;
    readonly trackByText = trackByProp<ExpandableMenuItem>('text');
    constructor(private menuActionService: MenuActionsService) {}

    onClick(event: Event) {
        const action = this.findFirstNonEmpty(this.item);
        if (action && action !== this.item) {
            this.menuActionService.processClick(event, action, this.section);
        }
    }

    private findFirstNonEmpty(item: MenuContentItem): MenuContentItem | undefined {
        if (item.url || item.clickAction) {
            return item;
        }

        if (item.children) {
            for (const child of item.children) {
                const nonEmpty = this.findFirstNonEmpty(child);
                if (nonEmpty) {
                    return nonEmpty;
                }
            }
        }

        return;
    }
}
