import { Injectable } from '@angular/core';

import { TimerService } from '@frontend/vanilla/core';
import { Observable, Subject } from 'rxjs';

import { RtmsMessageEx } from '../rtms-common.models';
import { RtmsSubscriberService } from '../rtms-subscriber.service';
import { RtmsLayerMessagesStorageService } from './rtms-messages-storage.service';

@Injectable({
    providedIn: 'root',
})
export class RtmsLayerNotificationQueue {
    private _messageList: RtmsMessageEx[];
    private _lastDequeueMessage: RtmsMessageEx;
    private _rtmsMessagesSubject: Subject<RtmsMessageEx | null>;

    constructor(
        private messageStorage: RtmsLayerMessagesStorageService,
        rtmsMessagePubSub: RtmsSubscriberService,
        private timer: TimerService,
    ) {
        this._rtmsMessagesSubject = new Subject<RtmsMessageEx | null>();
        this._messageList = [];
        rtmsMessagePubSub.messages.subscribe((e: RtmsMessageEx) => this._enqueue(e));
        this.timer.setTimeoutOutsideAngularZone(() => {
            this.messageStorage.getAll().subscribe((messages: RtmsMessageEx[]) => {
                this._messageList = this._messageList.concat(messages);
                if (this.hasMessages()) {
                    this._rtmsMessagesSubject.next(this.dequeue(false));
                }
            });
        }, 2000);
    }

    dequeue(dequeueWithRemoving: boolean = true): RtmsMessageEx | null {
        if (this.hasMessages()) {
            this._lastDequeueMessage = Object.assign(new RtmsMessageEx(), this._messageList[0]);
            if (dequeueWithRemoving) {
                const id: string = this._lastDequeueMessage.messageId;
                this._messageList = this._messageList.filter((e) => e.messageId !== id);
                this.messageStorage.delete(id);
                return this._lastDequeueMessage;
            } else {
                return this._lastDequeueMessage;
            }
        }
        return null;
    }

    get messageList(): RtmsMessageEx[] {
        return this._messageList;
    }

    get newMsObserver(): Observable<RtmsMessageEx | null> {
        return this._rtmsMessagesSubject;
    }

    hasMessages(): boolean {
        return !!this._messageList.length;
    }

    private _enqueue(message: RtmsMessageEx) {
        this._messageList.push(message);
        this.messageStorage.set(message);
        this._rtmsMessagesSubject.next(message);
    }
}
