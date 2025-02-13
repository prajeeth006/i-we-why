import { Component, Input } from '@angular/core';

import { TrustAsHtmlPipe } from '@frontend/vanilla/shared/browser';

@Component({
    standalone: true,
    imports: [TrustAsHtmlPipe],
    selector: 'vn-copyright',
    template: '@if (copyright) {<div [innerHTML]="copyright | trustAsHtml"></div>}',
})
export class CopyrightComponent {
    @Input() copyright: string | undefined;
}
