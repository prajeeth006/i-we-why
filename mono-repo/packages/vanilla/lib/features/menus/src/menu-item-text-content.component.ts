import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import { TrustAsHtmlPipe } from '@frontend/vanilla/shared/browser';

@Component({
    standalone: true,
    imports: [TrustAsHtmlPipe, CommonModule],
    selector: 'vn-menu-item-text-content',
    templateUrl: 'menu-item-text-content.html',
})
export class MenuItemTextContentComponent {
    @Input() text: string;
    @Input() cssClass: string;
    @Input() additionalClass?: string | string[];
    @Input() renderHtmlText?: boolean;
}
