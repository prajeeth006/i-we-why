import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { IconCustomComponent } from '@frontend/vanilla/features/icons';

import { AccountMenuItemBase } from '../account-menu-item-base';

@Component({
    standalone: true,
    imports: [CommonModule, IconCustomComponent],
    selector: 'vn-am-header-close',
    templateUrl: 'header-close.html',
})
export class HeaderCloseComponent extends AccountMenuItemBase {
    constructor() {
        super();
    }

    close() {
        this.accountMenuService.toggle(false, {
            closedWithButton: true,
        });
    }
}
