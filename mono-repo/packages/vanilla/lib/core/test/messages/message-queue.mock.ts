import { signal } from '@angular/core';

import { Message, MessageQueueService } from '@frontend/vanilla/core';
import { Mock, Stub } from 'moxxi';

@Mock({ of: MessageQueueService })
export class MessageQueueServiceMock {
    messages = signal<Message[]>([]);
    @Stub() add: jasmine.Spy;
    @Stub() addError: jasmine.Spy;
    @Stub() addInfo: jasmine.Spy;
    @Stub() addSuccess: jasmine.Spy;
    @Stub() addMultiple: jasmine.Spy;
    @Stub() count: jasmine.Spy;
    @Stub() remove: jasmine.Spy;
    @Stub() clear: jasmine.Spy;
    @Stub() storeMessages: jasmine.Spy;
    @Stub() restoreMessages: jasmine.Spy;
    @Stub() changeScope: jasmine.Spy;
}
