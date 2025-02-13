import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { trackByProp } from '@frontend/vanilla/core';
import { LabelSwitcherItem, LabelSwitcherService } from '@frontend/vanilla/features/label-switcher';
import { AccountMenuDataService } from '@frontend/vanilla/shared/account-menu';

import { AccountMenuTrackingService } from '../../src/account-menu-tracking.service';

@Component({
    standalone: true,
    imports: [CommonModule],
    selector: 'vn-label-switcher-menu',
    templateUrl: 'label-switcher-menu.html',
})
export class LabelSwitcherMenuComponent {
    constructor(
        public service: LabelSwitcherService,
        public accountMenuDataService: AccountMenuDataService,
        public accountMenuTrackingService: AccountMenuTrackingService,
    ) {}
    readonly trackByName = trackByProp<LabelSwitcherItem>('name');

    async switchLabel(item: LabelSwitcherItem) {
        if (item.isActive) return;

        this.accountMenuTrackingService.trackLabelSwitcherMenuClicked(item?.text, this.service.currentLabelItem?.text, item.url);
        await this.service.switchLabel(item);
    }
}
