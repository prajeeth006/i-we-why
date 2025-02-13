import { Directive, Input, Type, inject } from '@angular/core';

import {
    MenuActionOrigin,
    MenuActionsService,
    MenuContentItem,
    MenuDisplayMode,
    MenuItemType,
    MenuSection,
    Page,
    UtilsService,
    VanillaElements,
    toBoolean,
    trackByProp,
} from '@frontend/vanilla/core';
import { AccountMenuRouter } from '@frontend/vanilla/shared/account-menu';

import { AccountMenuService } from './account-menu.service';

/** @stable */
@Directive()
export abstract class AccountMenuItemBase {
    @Input() item: MenuContentItem;
    @Input() mode: string;
    readonly trackByText = trackByProp<MenuContentItem>('text');
    protected accountMenuService = inject(AccountMenuService);
    protected menuActionsService = inject(MenuActionsService);
    protected accountMenuRouter = inject(AccountMenuRouter);

    MenuSection = MenuSection;
    VanillaElements = VanillaElements;
    private pageConfig = inject(Page);
    get useFastIconType(): boolean {
        return this.pageConfig.htmlSourceTypeReplace
            ? UtilsService.indexableTypeContainsKey(this.pageConfig.htmlSourceTypeReplace, 'account-menu')
            : false;
    }
    get version(): number {
        return this.accountMenuService.version;
    }

    get isCH(): boolean {
        return this.version === 3 || this.version === 5;
    }

    getItemComponent(type: string): Type<any> | null {
        return this.accountMenuService.getAccountMenuComponent(type);
    }

    processClick(event: Event, item: MenuContentItem, shouldTrack: boolean = true) {
        event.stopPropagation();
        if (item.type === MenuItemType.TextWidget && !item.url) {
            return;
        }

        if (this.canNavigateToMenuRoute(item)) {
            this.accountMenuRouter.navigateToRoute(item.menuRoute);
            event.preventDefault();
        } else {
            if (!this.accountMenuService.routerMode) {
                this.accountMenuService.toggle(false);

                if (!toBoolean(item.parameters['set-active-item-disabled'])) {
                    this.accountMenuService.setActiveItem(item.name);
                }
            }

            this.menuActionsService.processClick(event, item, MenuActionOrigin.Menu, shouldTrack);
        }
    }

    private canNavigateToMenuRoute(item: MenuContentItem): boolean {
        if (!item.menuRoute) {
            return false;
        }

        const menuRouteStrategy: 'always' | 'router-mode-only' | 'overlay-only' | 'never' =
            <any>item.parameters['menu-route-navigation-strategy'] || 'always';
        switch (menuRouteStrategy) {
            case 'always':
                return true;
            case 'never':
                return false;
            case 'router-mode-only':
                return this.accountMenuService.routerMode;
            case 'overlay-only':
                return !this.accountMenuService.routerMode;
            default:
                throw new Error(`Invalid menu-route-navigation-strategy value ${menuRouteStrategy}.`);
        }
    }

    findMenuDisplayMode(): MenuDisplayMode {
        return this.useFastIconType === true ? MenuDisplayMode.FastIcon : MenuDisplayMode.Icon;
    }
    findBadgePosition(): 'icon' | 'beforeText' | 'afterText' | 'FastIcon' | undefined {
        return this.useFastIconType === true ? 'FastIcon' : 'icon';
    }
}
