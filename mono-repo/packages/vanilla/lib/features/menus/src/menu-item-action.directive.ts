import { Directive, HostListener, Input, inject } from '@angular/core';

import { MenuContentItem } from '@frontend/vanilla/core';

import { MenuItemClickHandlerService } from './menu-item-click-handler.service';

/**
 * @whatItDoes Executes click actions defined for the item and registered either in Vanilla or Product side.
 *
 * @howToUse
 *
 * ```
 * <ng-container vnMenuItemAction [item]="item" [origin]="origin" />
 * ```
 * @stable
 */
@Directive({
    standalone: true,
    selector: '[vnMenuItemAction]',
})
export class MenuItemActionDirective {
    private menuItemClickHandlerService = inject(MenuItemClickHandlerService);
    @HostListener('click', ['$event']) async onClick($event: Event) {
        await this.click($event);
    }

    @Input() item: MenuContentItem;
    @Input() origin: string;
    @Input() processClick: boolean | undefined;

    async click(event: Event) {
        await this.menuItemClickHandlerService.handleMenuAction(event, this.item, this.origin, this.processClick);
    }
}
