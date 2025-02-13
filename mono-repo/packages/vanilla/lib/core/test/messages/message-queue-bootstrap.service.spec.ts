import { TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { MessageQueueBootstrapService } from '../../src/messages/message-queue-bootstrap.service';
import { NavigationServiceMock } from '../navigation/navigation.mock';
import { MessageQueueServiceMock } from './message-queue.mock';

describe('MessageQueueBootstrapService', () => {
    let service: MessageQueueBootstrapService;
    let messageQueueServiceMock: MessageQueueServiceMock;
    let navigationServiceMock: NavigationServiceMock;

    beforeEach(() => {
        messageQueueServiceMock = MockContext.useMock(MessageQueueServiceMock);
        navigationServiceMock = MockContext.useMock(NavigationServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, MessageQueueBootstrapService],
        });

        service = TestBed.inject(MessageQueueBootstrapService);
    });

    describe('onAppInit()', () => {
        it('should restore messages', () => {
            service.onAppInit();

            expect(messageQueueServiceMock.restoreMessages).toHaveBeenCalled();
        });

        it('should clear messages on location change (after the initial navigation)', () => {
            service.onAppInit();

            navigationServiceMock.locationChange.next({ id: 0, nextUrl: '', previousUrl: '' });
            expect(messageQueueServiceMock.clear).not.toHaveBeenCalled();

            navigationServiceMock.locationChange.next({ id: 0, nextUrl: '', previousUrl: '' });
            expect(messageQueueServiceMock.clear).toHaveBeenCalledTimes(1);

            navigationServiceMock.locationChange.next({ id: 0, nextUrl: '', previousUrl: '' });
            expect(messageQueueServiceMock.clear).toHaveBeenCalledTimes(2);
        });
    });
});
