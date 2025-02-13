import { TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';
import { first } from 'rxjs/operators';

import { InboxDataService } from '../src/services/inbox-data.service';
import { InboxResourceServiceMock } from './inbox.mocks';

describe('InboxDataService', () => {
    let service: InboxDataService;
    let inboxResourceServiceMock: InboxResourceServiceMock;
    const data = { content: { a: 1 } };

    beforeEach(() => {
        inboxResourceServiceMock = MockContext.useMock(InboxResourceServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, InboxDataService],
        });

        service = TestBed.inject(InboxDataService);
    });

    describe('getContent()', () => {
        it('should provide content from resource service', () => {
            const spy = jasmine.createSpy();

            service.getContent().subscribe(spy);

            expect(inboxResourceServiceMock.getInboxMessagesInitData).toHaveBeenCalled();

            inboxResourceServiceMock.getInboxMessagesInitData.next(data);

            expect(spy).toHaveBeenCalledWith(data.content);
        });

        it('should replay for others', () => {
            const spy = jasmine.createSpy();

            service.getContent().pipe(first()).subscribe(spy);
            inboxResourceServiceMock.getInboxMessagesInitData.next(data);
            service.getContent().pipe(first()).subscribe(spy);

            expect(inboxResourceServiceMock.getInboxMessagesInitData).toHaveBeenCalledTimes(1);
        });
    });
});
