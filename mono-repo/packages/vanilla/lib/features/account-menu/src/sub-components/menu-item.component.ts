import { CommonModule } from '@angular/common';
import { Component, HostBinding, OnInit } from '@angular/core';

import { MenuDisplayMode } from '@frontend/vanilla/core';
import { MenuItemComponent as MenuItemFeatureComponent } from '@frontend/vanilla/features/menus';

import { AccountMenuItemBase } from '../account-menu-item-base';

@Component({
    standalone: true,
    imports: [CommonModule, MenuItemFeatureComponent],
    selector: 'vn-am-menu-item',
    templateUrl: 'menu-item.html',
})
export class MenuItemComponent extends AccountMenuItemBase implements OnInit {
    additionalIcon: string;
    show: boolean = true;
    menuDisplayMode: MenuDisplayMode;
    badgeDisplayMode: 'icon' | 'beforeText' | 'afterText' | 'FastIcon' | undefined;
    constructor() {
        super();
    }

    @HostBinding('class') get class() {
        return `${this.item.parameters['vn-am-menu-item-class'] || ''}`;
    }

    ngOnInit() {
        this.menuDisplayMode = this.findMenuDisplayMode();
        this.badgeDisplayMode = this.findBadgePosition();
        if (this.item.children?.length > 0) {
            this.additionalIcon = 'theme-right';
        }

        if (this.item?.parameters['mode'] && this.item.parameters['mode'] !== this.mode) {
            this.show = false;
        }
    }
}
