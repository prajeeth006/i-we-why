import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { TrustAsHtmlPipe } from '@frontend/vanilla/shared/browser';

import { AccountMenuItemBase } from '../account-menu-item-base';

@Component({
    standalone: true,
    imports: [CommonModule, TrustAsHtmlPipe],
    selector: 'vn-am-text',
    templateUrl: 'text.html',
})
export class TextComponent extends AccountMenuItemBase {
    constructor() {
        super();
    }
}
