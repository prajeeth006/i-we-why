import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { DynamicComponentDirective, ElementKeyDirective, UserService } from '@frontend/vanilla/core';
import { DslPipe, TrustAsHtmlPipe } from '@frontend/vanilla/shared/browser';
import { ImageComponent } from '@frontend/vanilla/shared/image';

import { AccountMenuItemBase } from '../account-menu-item-base';
import { AccountMenuScrollService } from '../account-menu-scroll.service';

@Component({
    standalone: true,
    imports: [CommonModule, DynamicComponentDirective, ElementKeyDirective, DslPipe, TrustAsHtmlPipe, ImageComponent],
    selector: 'vn-am-header-account',
    templateUrl: 'header-account.html',
})
export class HeaderAccountComponent extends AccountMenuItemBase implements OnInit {
    scrolled: boolean;

    constructor(
        public user: UserService,
        private accountMenuScrollService: AccountMenuScrollService,
    ) {
        super();
    }

    ngOnInit() {
        this.accountMenuScrollService.scroll.subscribe((pos) => {
            this.scrolled = pos > 0;
        });
    }

    restore() {
        this.accountMenuScrollService.scrollTo(0, 0);
    }
}
