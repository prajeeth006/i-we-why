import { Injectable } from '@angular/core';

import { SharedFeaturesApiService } from '@frontend/vanilla/core';
import { Observable } from 'rxjs';

import { InboxGetCountResponse, InboxGetListResponse, MessageStatus, StatusType } from './inbox.models';

@Injectable({ providedIn: 'root' })
export class InboxResourceService {
    constructor(private api: SharedFeaturesApiService) {}

    getMessages(pageIndex: number, pageSize: number, messageStatus: StatusType): Observable<InboxGetListResponse> {
        return this.api.get('inbox/list', {
            pageIndex: pageIndex,
            pageSize: pageSize,
            messageStatus: messageStatus,
        });
    }

    getMessagesCount(): Observable<InboxGetCountResponse> {
        return this.api.get('inbox/count');
    }

    getMessage(id: string) {
        return this.api.get('inbox/single', { id: id });
    }

    removeMessages(ids: string[]) {
        return this.api.post('inbox/remove', { ids: ids });
    }

    updateStatus(ids: string[], messageStatus: MessageStatus) {
        return this.api.post('inbox/setstatus', { ids: ids, status: messageStatus.toString() }, { showSpinner: false });
    }

    getInboxMessagesInitData() {
        return this.api.get('inbox/initdata');
    }
}
