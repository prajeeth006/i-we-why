import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { HeaderItemBase } from '../header-item-base';

@Component({
    standalone: true,
    imports: [CommonModule],
    selector: 'vn-h-text',
    templateUrl: 'text.html',
})
export class TextComponent extends HeaderItemBase {
    constructor() {
        super();
    }
}
