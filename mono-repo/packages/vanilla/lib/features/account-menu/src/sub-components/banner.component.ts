import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { ImageComponent } from '@frontend/vanilla/shared/image';

import { AccountMenuItemBase } from '../account-menu-item-base';

@Component({
    standalone: true,
    imports: [CommonModule, ImageComponent],
    selector: 'vn-am-banner',
    templateUrl: 'banner.html',
})
export class BannerComponent extends AccountMenuItemBase {
    constructor() {
        super();
    }
}
