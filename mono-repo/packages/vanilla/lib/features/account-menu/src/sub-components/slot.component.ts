import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { DynamicLayoutSlotComponent } from '@frontend/vanilla/core';

import { AccountMenuItemBase } from '../account-menu-item-base';

@Component({
    standalone: true,
    imports: [CommonModule, DynamicLayoutSlotComponent],
    selector: 'vn-am-slot',
    templateUrl: 'slot.html',
})
export class SlotComponent extends AccountMenuItemBase {
    constructor() {
        super();
    }
}
