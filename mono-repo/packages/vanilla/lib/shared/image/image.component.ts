import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, Input, ViewEncapsulation } from '@angular/core';

import { TrustAsHtmlPipe } from '@frontend/vanilla/shared/browser';

@Component({
    standalone: true,
    imports: [CommonModule, TrustAsHtmlPipe, NgOptimizedImage],
    selector: 'vn-image',
    templateUrl: 'image.html',
    styleUrls: ['../../../../themepark/themes/whitelabel/components/vn-img/styles.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class ImageComponent {
    @Input() src: string;
    @Input() alt?: string;
    @Input() height?: number;
    @Input() width?: number;
    @Input() imageClass?: string;
    @Input() textClass?: string = 'generic';
    @Input() intro?: string;
    @Input() title?: string;
    @Input() subtitle?: string;
    @Input() titleFontSize?: string;
    @Input() textAlign?: string;
    @Input() priority: boolean | undefined;
}
