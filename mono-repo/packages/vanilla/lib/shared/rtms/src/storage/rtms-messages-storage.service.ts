import { Injectable } from '@angular/core';

import { UserService } from '@frontend/vanilla/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { RtmsMessageEx } from '../rtms-common.models';
import { RtmsLocalStoreService } from './low-level-storage/rtms-localstorage.service';

@Injectable({
    providedIn: 'root',
})
export class RtmsLayerMessagesStorageService {
    private readonly rtmsMessagesStorageKey: string = 'rtmsMessages';

    constructor(
        private user: UserService,
        private rtmsLocalStore: RtmsLocalStoreService,
    ) {}

    getAll(): Observable<RtmsMessageEx[]> {
        return this._getAll().pipe(map((messages: RtmsMessageEx[]) => this._filterByUser(messages)));
    }

    set(newMessage: RtmsMessageEx): void {
        this._getAll().subscribe((messages: RtmsMessageEx[]) => {
            if (!this._hasSameRtmsMessage(messages, newMessage)) {
                this.rtmsLocalStore.set(this.rtmsMessagesStorageKey, messages.concat(newMessage));
            }
        });
    }

    delete(delParam: string | RtmsMessageEx): void {
        this._getAll().subscribe((allStored: RtmsMessageEx[]) => {
            const index = allStored.map((e: RtmsMessageEx) => e.messageId).indexOf(typeof delParam === 'string' ? delParam : delParam.messageId);

            if (index === -1) return;

            allStored.splice(index, 1);

            //update rtms messages in local storage
            this.rtmsLocalStore.set(this.rtmsMessagesStorageKey, allStored);
        });
    }

    private _getAll(): Observable<RtmsMessageEx[]> {
        return this.rtmsLocalStore.get<RtmsMessageEx[]>(this.rtmsMessagesStorageKey).pipe(map((messages: RtmsMessageEx[]) => messages || []));
    }

    private _filterByUser(messages: RtmsMessageEx[]): RtmsMessageEx[] {
        return messages.filter((message: RtmsMessageEx) => this.user.username === message.destinationUserName);
    }

    private _hasSameRtmsMessage(storeMessages: RtmsMessageEx[], newMessage: RtmsMessageEx): boolean {
        const payloadKeysOrdered: string[] = Object.keys(newMessage.payload);
        return storeMessages.some(
            (m) =>
                m.destinationUserName === newMessage.destinationUserName &&
                m.type === newMessage.type &&
                JSON.stringify(m.payload, payloadKeysOrdered) === JSON.stringify(newMessage.payload, payloadKeysOrdered),
        );
    }
}
