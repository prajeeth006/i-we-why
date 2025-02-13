import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { LabelSwitcherService } from '@frontend/vanilla/features/label-switcher';
import { MenuItemComponent } from '@frontend/vanilla/features/menus';

import { AccountMenuItemBase } from '../account-menu-item-base';

@Component({
    standalone: true,
    imports: [CommonModule, MenuItemComponent],
    selector: 'vn-am-label-switcher-item',
    templateUrl: 'label-switcher-item.html',
})
export class LabelSwitcherItemComponent extends AccountMenuItemBase implements OnInit {
    text: string | undefined;

    constructor(private labelSwitcherService: LabelSwitcherService) {
        super();
    }

    ngOnInit() {
        this.text = this.labelSwitcherService.currentLabelItem?.text;
    }
}
