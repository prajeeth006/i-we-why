import { Injectable } from '@angular/core';

import { Logger, ViewTemplateForClient } from '@frontend/vanilla/core';
import { Observable, of } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';

import { RtmsLayerNotificationQueue } from '../../src/storage/rtms-notification-queue.service';
import { NotificationMessage, RtmsLayerMessageRequest, RtmsMessageEx } from '../rtms-common.models';
import { RtmsLayerResourceService } from './rtms-resource.service';

@Injectable({
    providedIn: 'root',
})
export class RtmsLayerContentCacheManagerService {
    private _messageIdContentMap: { [key: string]: NotificationMessage };
    private _rtmsSitecoreContent: ViewTemplateForClient;

    constructor(
        private rtmsNotificationQueue: RtmsLayerNotificationQueue,
        private rtmsLayerResource: RtmsLayerResourceService,
        private logger: Logger,
    ) {
        this._messageIdContentMap = {};
    }

    getMessagesContent(message: RtmsMessageEx | string): Observable<NotificationMessage> {
        const messageId: string = typeof message === 'string' ? message : message.messageId;
        let existsContent: NotificationMessage;
        // eslint-disable-next-line no-cond-assign
        return (existsContent = this._getFromCacheIfExistsAndRemove(messageId))
            ? of<NotificationMessage>(existsContent)
            : this._loadNewContent()!.pipe(filter(() => !!this._getFromCacheIfExistsAndRemove(messageId)));
    }

    get sitecoreContent(): ViewTemplateForClient {
        return this._rtmsSitecoreContent;
    }

    private _loadNewContent(): Observable<NotificationMessage> | null {
        const cachingKeys: string[] = Object.keys(this._messageIdContentMap);
        const messagesToLoading: RtmsMessageEx[] = this.rtmsNotificationQueue.messageList.filter((m) => cachingKeys.indexOf(m.messageId) === -1);

        if (messagesToLoading.length) {
            if (!this._rtmsSitecoreContent) {
                return this.rtmsLayerResource.getMessagesInitData().pipe(
                    mergeMap((rtmsSitecoreContent: ViewTemplateForClient) => {
                        this._rtmsSitecoreContent = rtmsSitecoreContent;
                        return this._getMessageContent(messagesToLoading);
                    }),
                );
            }
            return this._getMessageContent(messagesToLoading);
        }

        return null;
    }

    private _transformToContentRequest(message: RtmsMessageEx): RtmsLayerMessageRequest {
        return new RtmsLayerMessageRequest(
            message.messageId,
            message.payload.baseTempletId,
            message.payload.offerTypes[0]!,
            message.payload.campaignId,
            message.payload.additionalInfo,
            message.payload.source,
        );
    }

    private _getFromCacheIfExistsAndRemove(id: string): NotificationMessage {
        const content: NotificationMessage = this._messageIdContentMap[id]!;
        if (content) {
            delete this._messageIdContentMap[id];
        }
        return content;
    }

    private _addContentToCache(messageId: string, content: NotificationMessage): NotificationMessage {
        return (this._messageIdContentMap[messageId] = content);
    }

    private _getMessageContent(messagesToLoading: RtmsMessageEx[]): Observable<NotificationMessage> {
        return this.rtmsLayerResource.getMessagesContent(messagesToLoading.map(this._transformToContentRequest)).pipe(
            map((msResult: NotificationMessage[]) => {
                //todo: error sitecore content: remove from queue
                if (msResult.length < messagesToLoading.length) {
                    const resultIds: string[] = msResult.map((x) => x.id);
                    const errorRtms = messagesToLoading.filter((m) => resultIds.indexOf(m.messageId) === -1);
                    msResult = msResult.concat(errorRtms.map((m) => NotificationMessage.ErrorMessage(m.messageId)));
                    this.logger.error('Error message content to %s messages: \n%s', errorRtms.length, JSON.stringify(errorRtms));
                }
                return msResult;
            }),
            mergeMap((m: any) => m),
            map((m: any) => this._addContentToCache(m.id, m)),
        );
    }
}
