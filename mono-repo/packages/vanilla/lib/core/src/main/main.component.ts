import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { DynamicLayoutSlotComponent } from '../dynamic-layout/dynamic-layout-slot.component';
import { DynamicLayoutService, SlotName } from '../dynamic-layout/dynamic-layout.service';

/**
 * @stable
 */
@Component({
    standalone: true,
    imports: [RouterModule, DynamicLayoutSlotComponent],
    selector: 'vn-main',
    templateUrl: 'main.html',
})
export class MainComponent {
    SlotName = SlotName;

    constructor(public dynamicLayoutService: DynamicLayoutService) {}
}
