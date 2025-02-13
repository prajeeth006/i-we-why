import { Injectable } from '@angular/core';

import { TrackingService } from '@frontend/vanilla/core';

import { InboxMessage } from './inbox.models';

const defaultPromiseResult = Promise.resolve<any>(0);

export interface InboxOpenedTrackingData {
    eventName: string | undefined;
    newMessagesCount?: number;
}

@Injectable({ providedIn: 'root' })
export class InboxTrackingService {
    constructor(private trackingService: TrackingService) {}

    trackInboxOpened(data?: InboxOpenedTrackingData) {
        let eventName, eventData;
        if (data) {
            eventName = data.eventName || 'Event.inbox.unknown_source';
            eventData = { 'page.inbox.newMessageCount': data.newMessagesCount ?? 0 };
        }
        return this.trackingService.triggerEvent(eventName || 'Event.inbox.clicked', eventData || null);
    }

    trackInboxClosed(message: InboxMessage) {
        return this.trackMessageAction('Event.inbox.messageClosed', {}, message);
    }

    trackInboxClosedEarly() {
        return this.trackingService.triggerEvent('Event.inbox.previewOpenedLessthan1Sec');
    }

    trackMessageOpened(message: InboxMessage) {
        if (!message) {
            return defaultPromiseResult;
        }
        return this.trackingService.triggerEvent('Event.inbox.messageOpened', this.getCommonValues(message));
    }

    trackMessageDeleted(count: number) {
        return this.trackingService.triggerEvent('Event.inbox.messageDeleted', {
            'page.inbox.deleteMessageCount': count,
        });
    }

    trackCtaBonusClicked(message: InboxMessage) {
        return this.trackMessageAction(
            'Event.inbox.claimBonusClicked',
            {
                'page.inbox.bonusId': message.offerId,
            },
            message,
        );
    }

    trackCtaBonusSuccess(message: InboxMessage) {
        return this.trackMessageAction(
            'Event.inbox.bonusOfferClaimSuccess',
            {
                'page.inbox.bonusId': message.offerId,
            },
            message,
        );
    }

    trackCtaPromoClicked(message: InboxMessage) {
        return this.trackMessageAction(
            'Event.inbox.optedInPromoClicked',
            {
                'page.inbox.promotionId': message.offerId,
            },
            message,
        );
    }

    trackCtaPromoSuccess(message: InboxMessage) {
        return this.trackMessageAction(
            'Event.inbox.optedInPromoSuccess',
            {
                'page.inbox.promotionId': message.offerId,
            },
            message,
        );
    }

    trackCtaEdsClicked(message: InboxMessage) {
        return this.trackMessageAction(
            'Event.inbox.optedInEdsEventClicked',
            {
                'page.inbox.eventId': message.offerId,
            },
            message,
        );
    }

    trackCtaEdsSuccess(message: InboxMessage) {
        return this.trackMessageAction(
            'Event.inbox.edsEventClaimSuccess',
            {
                'page.inbox.eventId': message.offerId,
            },
            message,
        );
    }

    trackKycVerifyClicked() {
        return this.trackingService.triggerEvent('Event.Functionality.JumioKyc', {
            'page.referringAction': 'KYC_PlayerInbox_TriggerKYC_LoadStatus_InboxMsg_Action_VerifyNow_Clicked',
        });
    }

    reportError(id: string, details?: any) {
        id = id || 'unknown';
        const errorDetails = Object.assign({ id: `inbox.${id}` }, details || {});
        this.trackingService.reportError(errorDetails);
    }

    private trackMessageAction(eventName: string, eventData: any, message: InboxMessage) {
        if (!message) {
            return defaultPromiseResult;
        }

        const data = Object.assign(this.getCommonValues(message), eventData);
        return this.trackingService.triggerEvent(eventName, data);
    }

    private getCommonValues(message: InboxMessage) {
        if (!message) {
            return {};
        }
        return {
            'page.inbox.messageSentDate': message.createdDate,
            'page.inbox.messageType': message.messageType,
            'page.inbox.messageSource': message.messageSource,
            'page.inbox.promotionId': message.bonusCode,
            'page.inbox.templateId': message.sitecoreId,
            'page.inbox.offerId': message.offerId,
            'page.inbox.isPreviewTncClicked': message.isTnCTemplate && message.isTnCViewed,
            'page.inbox.previewMode': false,
        };
    }
}
