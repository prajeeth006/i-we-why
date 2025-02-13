import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';

import { ContentMessagesComponent } from '@frontend/vanilla/features/content-messages';
import { KycStatusService } from '@frontend/vanilla/shared/kyc';

import { HeaderMessagesService } from '../header-messages.service';
import { HeaderService } from '../header.service';

@Component({
    standalone: true,
    imports: [CommonModule, ContentMessagesComponent],
    selector: 'vn-header-messages',
    templateUrl: 'header-messages.html',
})
export class HeaderMessagesComponent {
    headerService = inject(HeaderService);
    headerMessagesService = inject(HeaderMessagesService);
    kycStatusService = inject(KycStatusService);
}
