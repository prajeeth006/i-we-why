import { Component, OnInit, inject, signal } from '@angular/core';

import { UserService } from '@frontend/vanilla/core';
import { IconCustomComponent } from '@frontend/vanilla/features/icons';

import { AccountMenuItemBase } from '../account-menu-item-base';

@Component({
    standalone: true,
    imports: [IconCustomComponent],
    selector: 'vn-am-balance-title',
    templateUrl: 'balance-header-title.html',
})
export class BalanceHeaderTitleComponent extends AccountMenuItemBase implements OnInit {
    private user = inject(UserService);

    greetings = signal<string | null>(null);

    ngOnInit(): void {
        this.greetings.set(this.item.text?.replace('{DISPLAY_NAME}', this.user.displayName) ?? '');
    }
}
