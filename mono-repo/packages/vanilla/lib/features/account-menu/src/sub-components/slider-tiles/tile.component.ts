import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

import { AccountMenuItemBase } from '../../account-menu-item-base';

@Component({
    standalone: true,
    imports: [CommonModule],
    selector: 'vn-am-tile',
    templateUrl: 'tile.html',
})
export class AccountMenuTileComponent extends AccountMenuItemBase implements OnInit {
    @Input() cssClass: string | { [key: string]: boolean };

    moreInfo: string;

    constructor() {
        super();
    }

    ngOnInit() {
        this.moreInfo = this.accountMenuService.resources.messages['MoreInfoLink']!;
    }
}
