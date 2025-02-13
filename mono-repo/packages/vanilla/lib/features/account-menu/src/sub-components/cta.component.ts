import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { MenuDisplayMode } from '@frontend/vanilla/core';
import { MenuItemComponent } from '@frontend/vanilla/features/menus';

import { AccountMenuItemBase } from '../account-menu-item-base';

@Component({
    standalone: true,
    imports: [CommonModule, MenuItemComponent],
    selector: 'vn-am-cta',
    templateUrl: 'cta.html',
})
export class CtaComponent extends AccountMenuItemBase implements OnInit {
    linkClass: string = 'btn btn-primary';
    menuDisplayMode: MenuDisplayMode;
    constructor() {
        super();
    }
    ngOnInit(): void {
        this.menuDisplayMode = this.findMenuDisplayMode();
        this.linkClass = this.item.parameters['link-class'] ? this.item.parameters['link-class'] : this.linkClass;
    }
}

@Component({
    standalone: true,
    imports: [CommonModule, MenuItemComponent],
    selector: 'vn-am-cta-v3',
    templateUrl: 'cta.html',
})
export class CtaV3Component extends AccountMenuItemBase implements OnInit {
    linkClass: string = 'btn btn-icon btn-sm theme-handhsake mw-100';
    menuDisplayMode: MenuDisplayMode;
    constructor() {
        super();
    }
    ngOnInit(): void {
        this.linkClass = this.item.parameters['link-class'] ? this.linkClass + ' ' + this.item.parameters['link-class'] : this.linkClass;
        this.menuDisplayMode = this.findMenuDisplayMode();
    }
}
