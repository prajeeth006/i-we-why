import { CommonModule } from '@angular/common';
import { Component, Inject, InjectionToken, ViewEncapsulation } from '@angular/core';

import { ContentItem } from '@frontend/vanilla/core';
import { ContentMessagesComponent } from '@frontend/vanilla/features/content-messages';
import { Observable } from 'rxjs';

export const OVERLAY_MESSAGES_CONTENT = new InjectionToken<Observable<ContentItem[]>>('overlay-messages-content');

@Component({
    standalone: true,
    imports: [CommonModule, ContentMessagesComponent],
    selector: 'vn-overlay-messages',
    templateUrl: 'overlay-messages.html',
    styleUrls: ['../../../../../themepark/themes/whitelabel/components/overlay-messages/styles.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class OverlayMessagesComponent {
    constructor(@Inject(OVERLAY_MESSAGES_CONTENT) public content: Observable<ContentItem[]>) {}
}
