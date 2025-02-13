import { Component, OnInit } from '@angular/core';

import { InboxService as CoreInboxService } from '@frontend/vanilla/core';

import { InboxService } from '../services/inbox.service';
import { InboxComponent } from './inbox.component';

@Component({
    standalone: true,
    imports: [InboxComponent],
    selector: 'vn-inbox-view',
    templateUrl: 'inbox-view.html',
})
export class InboxViewComponent implements OnInit {
    constructor(
        private coreInboxService: CoreInboxService,
        private inboxService: InboxService,
    ) {}
    ngOnInit() {
        this.coreInboxService.set(this.inboxService);
    }
}
