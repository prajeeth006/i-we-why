import { ToastrQueueCurrentToastContext, ToastrQueueService } from '@frontend/vanilla/core';
import { Mock, Stub } from 'moxxi';

@Mock({ of: ToastrQueueService })
export class ToastrQueueServiceMock {
    @Stub() add: jasmine.Spy;
    @Stub() remove: jasmine.Spy;
    @Stub() clear: jasmine.Spy;
    @Stub() onNavigation: jasmine.Spy;
    currentToast: ToastrQueueCurrentToastContext;
}
