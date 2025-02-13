import { Component, ElementRef, Input } from '@angular/core';

import { DynamicHtmlDirective } from '@frontend/vanilla/core';

@Component({
    standalone: true,
    imports: [DynamicHtmlDirective],
    selector: 'vn-inbox-cta-content',
    template: `<div [vnDynamicHtml]="content"></div>`,
})
export class InboxCtaContentComponent {
    @Input() content: any;
    constructor(public elementRef: ElementRef) {}
}
