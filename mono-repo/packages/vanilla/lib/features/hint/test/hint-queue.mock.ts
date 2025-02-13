import { Mock, Stub } from 'moxxi';

import { HintQueueService } from '../src/hint-queue.service';

@Mock({ of: HintQueueService })
export class HintQueueServiceMock {
    @Stub() add: jasmine.Spy;
    @Stub() remove: jasmine.Spy;
    @Stub() clear: jasmine.Spy;
}
