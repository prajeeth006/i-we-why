import { Injectable } from '@angular/core';

import { OfferResponse, OffersResourceService } from '@frontend/vanilla/shared/offers';
import { BehaviorSubject, Observable, throwError as _throw } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { InboxResourceService } from './inbox-resource.service';
import { InboxTrackingService } from './inbox-tracking.service';
import { InboxGetListResponse, InboxMessage, MessageStatus, StatusType } from './inbox.models';

@Injectable({ providedIn: 'root' })
export class CrappyInboxService {
    messages: BehaviorSubject<InboxMessage[]>;
    wait: boolean = false;
    isAllMessagesLoaded: boolean = false;

    private _messageList: InboxMessage[];

    constructor(
        private resource: InboxResourceService,
        private tracking: InboxTrackingService,
        private offersResourceService: OffersResourceService,
    ) {
        this._messageList = [];
        this.messages = new BehaviorSubject<InboxMessage[]>(this._messageList);
    }

    getMessages(pageIndex: number, pageSize: number, messageStatus: StatusType): Observable<any> {
        return this.resource.getMessages(pageIndex, pageSize, messageStatus).pipe(
            catchError((err) => this.trackAndThrow(err, 'getMessages')),
            map((response: InboxGetListResponse) => {
                if (response.actualReceivedNumberOfMessages < pageSize) {
                    this.isAllMessagesLoaded = true;
                }

                this._messageList = this._messageList.concat(response.messages);
                this.emitMessages();
            }),
        );
    }

    resetMessages() {
        this.isAllMessagesLoaded = false;
        this._messageList = [];
        this.emitMessages();
    }

    updateStatus(ids: string[], messageStatus: MessageStatus): Observable<any> {
        return this.resource.updateStatus(ids, messageStatus);
    }

    claimOffer(offerType: string, offerId: string): Observable<OfferResponse> {
        return this.offersResourceService
            .updateStatus(offerType, offerId)
            .pipe(catchError((err: any) => this.trackAndThrow(err, 'claimOffer', { offerId: offerId, action: offerType })));
    }

    remove(ids: string[]): Observable<any> {
        return this.resource.removeMessages(ids).pipe(
            catchError((err: any) => {
                if (this._messageList !== null) {
                    this.emitMessages();
                }
                return _throw(err);
            }),
            map((response: any) => {
                if (this._messageList !== null && response && response.isUpdated) {
                    this._messageList = this._messageList.filter((el: InboxMessage) => {
                        return ids.indexOf(el.id) < 0;
                    });
                    this.emitMessages();
                }

                return response;
            }),
        );
    }

    isDepositBonusLink(rawLink: string, additionalAttrs: { [key: string]: string }): boolean {
        return !!(rawLink?.match(/mobileportal\/cashier.*/i) && additionalAttrs && additionalAttrs['data-bonuscode']?.trim());
    }

    getDepositBonusLink(rawLink: string, additionalAttrs: { [key: string]: string }): string {
        if (!rawLink) return rawLink;
        if (this.isDepositBonusLink(rawLink, additionalAttrs)) {
            const depositBonusPartUrl = `mobileportal/cashier/deposit?bonusCodeForPrefill=${additionalAttrs['data-bonuscode']?.trim()}`;
            return rawLink.replace(/mobileportal\/cashier.*/i, depositBonusPartUrl);
        }
        return rawLink;
    }

    private emitMessages() {
        this.messages.next(this._messageList);
    }

    private trackAndThrow(error: any, id: string, details?: any): Observable<never> {
        this.tracking.reportError(id, details || null);

        return _throw(error);
    }
}
