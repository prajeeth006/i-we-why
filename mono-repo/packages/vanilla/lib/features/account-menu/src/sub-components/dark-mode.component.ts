import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';

import { CommonMessages, MenuContentItem } from '@frontend/vanilla/core';
import { IconCustomComponent } from '@frontend/vanilla/features/icons';
import { DarkModeService } from '@frontend/vanilla/shared/dark-mode';

import { AccountMenuTrackingService } from '../account-menu-tracking.service';

/**
 * @stable
 */
@Component({
    standalone: true,
    selector: 'vn-am-dark-mode',
    templateUrl: 'dark-mode.html',
    imports: [CommonModule, IconCustomComponent],
})
export class DarkModeToggleComponent {
    public service = inject(DarkModeService);
    public content = inject(CommonMessages);
    private accountMenuTrackingService = inject(AccountMenuTrackingService);

    @Input() item: MenuContentItem;

    toggleDarkMode() {
        this.accountMenuTrackingService.trackDarkModeToggle(!this.service.isEnabled);
        this.service.toggle();
    }
}
