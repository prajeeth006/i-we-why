import { Injectable } from '@angular/core';

import { Logger, RtmsMessage, RtmsService, RtmsType, UserService, UtilsService } from '@frontend/vanilla/core';
import { Subject } from 'rxjs';
import { filter } from 'rxjs/operators';

import { RtmsMessageEx } from './rtms-common.models';

@Injectable({
    providedIn: 'root',
})
export class RtmsSubscriberService {
    messages: Subject<RtmsMessageEx> = new Subject<RtmsMessageEx>();
    private messageEventIds: string[] = [];

    constructor(
        private utils: UtilsService,
        private rtmsService: RtmsService,
        private user: UserService,
        private logger: Logger,
    ) {}

    init() {
        this.initOverlayAndToasterEvents();
    }

    private initOverlayAndToasterEvents() {
        this.rtmsService.messages
            .pipe(filter((message) => message.type === RtmsType.OVERLAY || message.type === RtmsType.TOASTER))
            .subscribe((message) => this.handleMessage(message));
    }

    private handleMessage(message: RtmsMessage) {
        const ms: RtmsMessageEx = <RtmsMessageEx>message;
        if (ms.payload && this.messageEventIds.indexOf(message.eventId) === -1) {
            if (message.eventId) {
                this.messageEventIds.push(message.eventId);
            }
            ms.payload = typeof message.payload === 'string' ? JSON.parse(message.payload) : message.payload;
            if (ms.payload.baseTempletId && ms.payload.additionalInfo && ms.payload.offerTypes && ms.payload.offerTypes.length) {
                ms.messageId = this.utils.generateGuid();
                ms.destinationUserName = this.user.username!;
                this.messages.next(ms);
                this.logger.debug(`RTMS message received: ${JSON.stringify(message)}`);
                return;
            }
        }
        this.logger.error(`RTMS message not valid: ${JSON.stringify(message)}`);
    }
}
