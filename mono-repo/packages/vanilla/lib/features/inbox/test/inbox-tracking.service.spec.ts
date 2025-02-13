import { TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { TrackingServiceMock } from '../../../core/src/tracking/test/tracking.mock';
import { InboxTrackingService } from '../src/services/inbox-tracking.service';
import { InboxMessage, MessageType } from '../src/services/inbox.models';

describe('InboxTrackingService', () => {
    let service: InboxTrackingService;
    let message: InboxMessage;
    let trackingServiceMock: TrackingServiceMock;

    beforeEach(() => {
        trackingServiceMock = MockContext.useMock(TrackingServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, InboxTrackingService],
        });
    });
    beforeEach(() => {
        service = TestBed.inject(InboxTrackingService);
        message = createMessage();
    });

    it('should not be undefined or null', () => {
        expect(service).toBeDefined();
    });

    describe('trackInboxOpened()', () => {
        it('should call triggerEvent using default eventName', () => {
            service.trackInboxOpened();
            expect(trackingServiceMock.triggerEvent).toHaveBeenCalledWith('Event.inbox.clicked', null);
        });

        it('should call triggerEvent with eventName from trackingData', () => {
            service.trackInboxOpened({ eventName: 'event-name' });
            expect(trackingServiceMock.triggerEvent).toHaveBeenCalledWith('event-name', { 'page.inbox.newMessageCount': 0 });
        });

        it('should call triggerEvent with eventData from trackingData', () => {
            service.trackInboxOpened({ eventName: 'event-name', newMessagesCount: 1 });
            expect(trackingServiceMock.triggerEvent).toHaveBeenCalledWith('event-name', { 'page.inbox.newMessageCount': 1 });
        });
    });

    it('trackInboxClosedEarly() should call triggerEvent', () => {
        service.trackInboxClosedEarly();
        expect(trackingServiceMock.triggerEvent).toHaveBeenCalledWith('Event.inbox.previewOpenedLessthan1Sec');
    });

    describe('trackMessageOpened()', () => {
        it('should not call triggerEvent when no message', () => {
            service.trackMessageOpened(<any>null);
            expect(trackingServiceMock.triggerEvent).not.toHaveBeenCalled();
        });

        it('trackMessageOpened() should call triggerEvent when message', () => {
            service.trackMessageOpened(message);
            const expectedData = extractTrackingData(message);
            expect(trackingServiceMock.triggerEvent).toHaveBeenCalledWith('Event.inbox.messageOpened', expectedData);
        });
    });

    it('trackMessageDeleted() should call triggerEvent with count', () => {
        service.trackMessageDeleted(2);
        expect(trackingServiceMock.triggerEvent).toHaveBeenCalledWith('Event.inbox.messageDeleted', {
            'page.inbox.deleteMessageCount': 2,
        });
    });

    it('trackCtaBonusClicked() should call triggerEvent', () => {
        service.trackCtaBonusClicked(message);
        const expectedData = extractTrackingData(message);
        (expectedData['page.inbox.bonusId'] = message.offerId),
            expect(trackingServiceMock.triggerEvent).toHaveBeenCalledWith('Event.inbox.claimBonusClicked', expectedData);
    });

    it('trackCtaBonusSuccess() should call triggerEvent', () => {
        service.trackCtaBonusSuccess(message);
        const expectedData = extractTrackingData(message);
        (expectedData['page.inbox.bonusId'] = message.offerId),
            expect(trackingServiceMock.triggerEvent).toHaveBeenCalledWith('Event.inbox.bonusOfferClaimSuccess', expectedData);
    });

    it('trackCtaPromoClicked() should call triggerEvent', () => {
        service.trackCtaPromoClicked(message);
        const expectedData = extractTrackingData(message);
        (expectedData['page.inbox.promotionId'] = message.offerId),
            expect(trackingServiceMock.triggerEvent).toHaveBeenCalledWith('Event.inbox.optedInPromoClicked', expectedData);
    });

    it('trackCtaPromoSuccess() should call triggerEvent', () => {
        service.trackCtaPromoSuccess(message);
        const expectedData = extractTrackingData(message);
        (expectedData['page.inbox.promotionId'] = message.offerId),
            expect(trackingServiceMock.triggerEvent).toHaveBeenCalledWith('Event.inbox.optedInPromoSuccess', expectedData);
    });

    it('trackCtaEdsClicked() should call triggerEvent', () => {
        service.trackCtaEdsClicked(message);
        const expectedData = extractTrackingData(message);
        (expectedData['page.inbox.eventId'] = message.offerId),
            expect(trackingServiceMock.triggerEvent).toHaveBeenCalledWith('Event.inbox.optedInEdsEventClicked', expectedData);
    });

    it('trackCtaEdsSuccess() should call triggerEvent', () => {
        service.trackCtaEdsSuccess(message);
        const expectedData = extractTrackingData(message);
        (expectedData['page.inbox.eventId'] = message.offerId),
            expect(trackingServiceMock.triggerEvent).toHaveBeenCalledWith('Event.inbox.edsEventClaimSuccess', expectedData);
    });

    it('trackKycVerifyClicked() should call triggerEvent', () => {
        service.trackKycVerifyClicked();
        expect(trackingServiceMock.triggerEvent).toHaveBeenCalledWith('Event.Functionality.JumioKyc', {
            'page.referringAction': 'KYC_PlayerInbox_TriggerKYC_LoadStatus_InboxMsg_Action_VerifyNow_Clicked',
        });
    });

    describe('reportError()', () => {
        it('should call reportError with unkown id when no id', () => {
            service.reportError(<any>null);
            expect(trackingServiceMock.reportError).toHaveBeenCalledWith({ id: 'inbox.unknown' });
        });

        it('should call reportError with prefixed id', () => {
            service.reportError('id');
            expect(trackingServiceMock.reportError).toHaveBeenCalledWith({ id: 'inbox.id' });
        });

        it('should call reportError with prefixed id and details', () => {
            service.reportError('error-id', { message: 'message' });
            expect(trackingServiceMock.reportError).toHaveBeenCalledWith({ id: 'inbox.error-id', message: 'message' });
        });
    });

    it('trackInboxClosed() should call triggerEvent', () => {
        service.trackInboxClosed(message);
        const expectedData = extractTrackingData(message);
        expect(trackingServiceMock.triggerEvent).toHaveBeenCalledWith('Event.inbox.messageClosed', expectedData);
    });

    function createMessage() {
        const message = new InboxMessage();
        message.createdDate = new Date(1970, 0, 1);
        message.messageType = MessageType.BONUS_OFFER;
        message.messageSource = 'source';
        message.bonusCode = 'promo/1';
        message.sitecoreId = 'tpl/1';
        message.offerId = 'offer/1';
        message.isTnCTemplate = false;
        message.isTnCViewed = false;
        return message;
    }

    function extractTrackingData(message: InboxMessage): Record<string, any> {
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
});
