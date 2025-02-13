import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { DynamicComponentDirective, MediaQueryService } from '@frontend/vanilla/core';
import { HeaderBarComponent } from '@frontend/vanilla/features/header-bar';
import { AccountMenuConfig } from '@frontend/vanilla/shared/account-menu';

import { AccountMenuItemBase } from '../account-menu-item-base';

@Component({
    standalone: true,
    imports: [CommonModule, HeaderBarComponent, DynamicComponentDirective],
    selector: 'vn-am-main-layout',
    templateUrl: 'main-layout.html',
})
export class MainLayoutComponent extends AccountMenuItemBase {
    constructor(
        public media: MediaQueryService,
        public config: AccountMenuConfig,
    ) {
        super();
    }

    close() {
        this.accountMenuService.toggle(false, {
            closedWithButton: true,
        });
    }
}
