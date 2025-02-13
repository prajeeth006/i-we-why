import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { ElementKeyDirective, UserService } from '@frontend/vanilla/core';
import { IconCustomComponent } from '@frontend/vanilla/features/icons';
import { ImageComponent } from '@frontend/vanilla/shared/image';

import { AccountMenuItemBase } from '../account-menu-item-base';
import { AccountMenuScrollService } from '../account-menu-scroll.service';
import { AccountMenuVipService } from '../account-menu-vip.service';

@Component({
    standalone: true,
    imports: [CommonModule, ElementKeyDirective, ImageComponent, IconCustomComponent],
    selector: 'vn-am-header-avatar',
    templateUrl: 'header-avatar.html',
})
export class HeaderAvatarComponent extends AccountMenuItemBase implements OnInit {
    scrolled: boolean;
    iconClass: string;

    constructor(
        public userService: UserService,
        public accountMenuVipService: AccountMenuVipService,
        private accountMenuScrollService: AccountMenuScrollService,
    ) {
        super();
    }

    ngOnInit() {
        this.iconClass = this.item.parameters?.['avatar-icon-class'] || 'theme-account';
        this.accountMenuScrollService.scroll.subscribe((pos: number) => {
            this.scrolled = pos > 0;
        });
    }

    restore() {
        this.accountMenuScrollService.scrollTo(0, 0);
    }
}
