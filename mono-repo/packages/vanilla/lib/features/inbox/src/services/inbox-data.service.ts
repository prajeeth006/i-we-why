import { Injectable } from '@angular/core';

import { ViewTemplateForClient } from '@frontend/vanilla/core';
import { Observable, ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';

import { InboxResourceService } from './inbox-resource.service';

/**
 * @stable
 */
@Injectable({ providedIn: 'root' })
export class InboxDataService {
    private contentStream: ReplaySubject<ViewTemplateForClient> | null = null;

    constructor(private inboxResourceService: InboxResourceService) {}

    getContent(): Observable<ViewTemplateForClient> {
        if (!this.contentStream) {
            this.contentStream = new ReplaySubject(1);
            this.inboxResourceService
                .getInboxMessagesInitData()
                .pipe(map((c) => c.content))
                .subscribe(this.contentStream);
        }
        return this.contentStream;
    }
}
