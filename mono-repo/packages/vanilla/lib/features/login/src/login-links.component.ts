import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import { DynamicHtmlDirective } from '@frontend/vanilla/core';

@Component({
    standalone: true,
    imports: [CommonModule, DynamicHtmlDirective],
    selector: 'lh-login-links',
    templateUrl: 'login-links.component.html',
})
export class LoginLinksComponent {
    @Input() highlightHints: boolean;
    @Input() text?: string;
}
