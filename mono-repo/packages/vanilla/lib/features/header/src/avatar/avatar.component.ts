import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { ElementKeyDirective, toBoolean } from '@frontend/vanilla/core';
import { IconCustomComponent } from '@frontend/vanilla/features/icons';
import { MenuItemBadgeDirective } from '@frontend/vanilla/features/menus';

import { HeaderItemBase } from '../header-item-base';

@Component({
    standalone: true,
    imports: [CommonModule, ElementKeyDirective, MenuItemBadgeDirective, IconCustomComponent],
    selector: 'vn-h-avatar',
    templateUrl: 'avatar.html',
})
export class AvatarComponent extends HeaderItemBase implements OnInit {
    avatarClass: string;
    iconClass: string;
    showBadge: boolean;

    constructor() {
        super();
    }

    ngOnInit() {
        this.avatarClass = this.item.parameters['avatar-class']!;
        this.iconClass = this.item.parameters['avatar-icon-class'] || 'theme-avatar';
        this.showBadge = toBoolean(this.item.parameters['show-badge'])!;
    }
}
