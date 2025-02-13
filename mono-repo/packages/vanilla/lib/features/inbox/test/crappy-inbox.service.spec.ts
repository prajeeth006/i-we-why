import { TestBed } from '@angular/core/testing';

import { OfferType } from '@frontend/vanilla/shared/offers';
import { MockContext } from 'moxxi';
import { catchError } from 'rxjs/operators';

import { CrappyInboxService } from '../../../features/inbox/src/services/crappy-inbox.service';
import { InboxMessage, MessageStatus, StatusType } from '../../../features/inbox/src/services/inbox.models';
import { OffersResourceServiceMock } from '../../../shared/offers/test/offers.mocks';
import { InboxResourceServiceMock, InboxTrackingServiceMock } from './inbox.mocks';

describe('CrappyInboxService', () => {
    let service: CrappyInboxService;
    let inboxResourceServiceMock: InboxResourceServiceMock;
    let trackingServiceMock: InboxTrackingServiceMock;
    let offersResourceServiceMock: OffersResourceServiceMock;

    beforeEach(() => {
        inboxResourceServiceMock = MockContext.useMock(InboxResourceServiceMock);
        trackingServiceMock = MockContext.useMock(InboxTrackingServiceMock);
        offersResourceServiceMock = MockContext.useMock(OffersResourceServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, CrappyInboxService],
        });
    });
    beforeEach(() => {
        service = TestBed.inject(CrappyInboxService);
    });

    it('variables and methods should be initialized correctly', () => {
        expect(service.messages).toBeDefined();
        expect(service.wait).toBeDefined();
        expect(service.isAllMessagesLoaded).toBeDefined();

        expect(service.getMessages).toBeDefined();
        expect(service.resetMessages).toBeDefined();
        expect(service.updateStatus).toBeDefined();
        expect(service.claimOffer).toBeDefined();
        expect(service.remove).toBeDefined();
    });

    it('should call resource get messages and emit messages on getMessages', () => {
        const messages = [new InboxMessage()];
        spyOn(service.messages, 'next');
        const pageSize = 10;
        service.getMessages(0, pageSize, <any>null).subscribe();
        inboxResourceServiceMock.getMessages.completeWith({ messages: messages, actualReceivedNumberOfMessages: 9 });
        expect(inboxResourceServiceMock.getMessages).toHaveBeenCalled();
        expect(service.isAllMessagesLoaded).toEqual(true);
        expect(service.messages.next).toHaveBeenCalledWith(messages);
    });

    it('should reset images list and emit messages on resetMessages', () => {
        spyOn(service.messages, 'next');
        service.isAllMessagesLoaded = true;
        service.resetMessages();
        expect(service.isAllMessagesLoaded).toEqual(false);
        expect(service.messages.next).toHaveBeenCalledWith([]);
    });

    it('should call resource.updateStatus on updateStatus', () => {
        const ids = ['1', '2', '3'];
        service.updateStatus(ids, MessageStatus.read);
        expect(inboxResourceServiceMock.updateStatus).toHaveBeenCalledWith(ids, MessageStatus.read);
    });

    it('should call resource.claimOffer on claimOffer', () => {
        const message = new InboxMessage();
        message.offerId = '1';
        const offerType = OfferType.EDS;
        service.claimOffer(offerType, message.offerId);
        expect(offersResourceServiceMock.updateStatus).toHaveBeenCalledWith(offerType, message.offerId);
    });

    it('should call resource.removeMessages on remove', () => {
        const messages = getMessagesMock();
        // service.messages.next(messages);
        service.getMessages(0, 0, StatusType.all).subscribe();
        inboxResourceServiceMock.getMessages.completeWith({
            messages: messages,
            actualReceivedNumberOfMessages: messages.length,
        });
        const idsToRemove = [messages[0]!.id, messages[1]!.id];

        spyOn(service.messages, 'next');
        service.remove(idsToRemove).subscribe();
        inboxResourceServiceMock.removeMessages.completeWith({ isUpdated: true });
        expect(inboxResourceServiceMock.removeMessages).toHaveBeenCalledWith(idsToRemove);
        expect(service.messages.next).toHaveBeenCalledWith([messages[2]!]);
    });

    describe('tracking', () => {
        it('should reportError when getMessages() fails', () => {
            const pageSize = 10;
            service
                .getMessages(0, pageSize, <any>null)
                .pipe(catchError((err) => err))
                .subscribe();
            inboxResourceServiceMock.getMessages.error([{ message: 'boom' }]);
            expect(trackingServiceMock.reportError).toHaveBeenCalledWith('getMessages', null);
        });

        it('should reportError when claimOffer() fails', () => {
            service
                .claimOffer(OfferType.EDS, '1')
                .pipe(catchError((err) => err))
                .subscribe();
            offersResourceServiceMock.updateStatus.error([{ message: 'boom' }]);
            expect(trackingServiceMock.reportError).toHaveBeenCalledWith('claimOffer', {
                offerId: '1',
                action: OfferType.EDS,
            });
        });
    });
});

function getMessagesMock() {
    const msg1 = new InboxMessage();
    msg1.selected = false;
    msg1.id = '1';
    const msg2 = new InboxMessage();
    msg2.selected = true;
    msg2.id = '2';
    const msg3 = new InboxMessage();
    msg3.selected = true;
    msg3.id = '3';
    return [msg1, msg2, msg3];
}
