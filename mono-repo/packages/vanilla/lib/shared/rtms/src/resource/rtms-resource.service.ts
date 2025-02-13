import { Injectable } from '@angular/core';

import { SharedFeaturesApiService, ViewTemplateForClient } from '@frontend/vanilla/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { NotificationMessage, RamsLayerMessageResponse, RtmsLayerMessageRequest } from '../rtms-common.models';

@Injectable({
    providedIn: 'root',
})
export class RtmsLayerResourceService {
    constructor(private api: SharedFeaturesApiService) {}

    getMessagesContent(requestData: Array<RtmsLayerMessageRequest>): Observable<Array<NotificationMessage>> {
        return this.api.post('rtms/messages', requestData, { showSpinner: false }).pipe(map((m: RamsLayerMessageResponse) => m.messages));
    }

    getMessagesInitData(): Observable<ViewTemplateForClient> {
        return this.api.get('rtms/messagesinitdata');
    }
}
