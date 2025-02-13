import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { UserService } from '@frontend/vanilla/core';

import { AccountMenuItemBase } from '../account-menu-item-base';

@Component({
    standalone: true,
    imports: [CommonModule],
    selector: 'vn-am-last-login',
    templateUrl: 'last-login.html',
})
export class LastLoginComponent extends AccountMenuItemBase implements OnInit {
    message: string;
    show: boolean = true;

    constructor(private user: UserService) {
        super();
    }

    ngOnInit() {
        if (this.user.isFirstLogin) {
            this.show = false;
        } else {
            this.message = this.item.text.replace('__DATE__', this.user.lastLoginTimeFormatted!);
        }
    }
}
