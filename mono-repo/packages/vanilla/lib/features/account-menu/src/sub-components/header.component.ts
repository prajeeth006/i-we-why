import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { DynamicComponentDirective } from '@frontend/vanilla/core';
import { IconCustomComponent } from '@frontend/vanilla/features/icons';

import { AccountMenuItemBase } from '../account-menu-item-base';
import { AccountMenuScrollService } from '../account-menu-scroll.service';

@Component({
    standalone: true,
    imports: [CommonModule, DynamicComponentDirective, IconCustomComponent],
    selector: 'vn-am-header',
    templateUrl: 'header.html',
})
export class HeaderComponent extends AccountMenuItemBase implements OnInit {
    scrolled: boolean;
    template: number;

    constructor(private accountMenuScrollService: AccountMenuScrollService) {
        super();
    }

    ngOnInit() {
        this.accountMenuScrollService.scroll.subscribe((pos) => {
            this.scrolled = pos > 0;
        });
    }

    close() {
        this.accountMenuService.toggle(false, {
            closedWithButton: true,
        });
    }
}
