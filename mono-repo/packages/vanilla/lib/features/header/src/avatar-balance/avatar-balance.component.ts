import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';

import { DynamicComponentDirective } from '@frontend/vanilla/core';
import { DslPipe } from '@frontend/vanilla/shared/browser';

import { GetLazyComponentPipe } from '../get-lazy-component.pipe';
import { HeaderItemBase } from '../header-item-base';

@Component({
    standalone: true,
    imports: [CommonModule, DynamicComponentDirective, DslPipe, GetLazyComponentPipe],
    selector: 'vn-h-avatar-balance',
    templateUrl: 'avatar-balance.html',
    styleUrls: ['../../../../../../themepark/themes/whitelabel/components/avatar-v2/styles.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class AvatarBalanceComponent extends HeaderItemBase {
    constructor() {
        super();
    }
}
