import { InboxService as InboxCoreService, InboxState } from '@frontend/vanilla/core';
import { Mock, Stub } from 'moxxi';
import { BehaviorSubject, ReplaySubject, Subject } from 'rxjs';

import { InboxService } from '../src/services/inbox.service';

@Mock({ of: InboxService })
export class InboxServiceMock {
    @Stub() open: jasmine.Spy;
    @Stub() close: jasmine.Spy;
    @Stub() setState: jasmine.Spy;
    @Stub() getCount: jasmine.Spy;

    whenReady = new Subject<void>();
    visible = new BehaviorSubject<boolean>(false);
    isEnabled: boolean;
    count = new ReplaySubject<number>(1);
    state = new BehaviorSubject<InboxState>({ isOpen: false });
}

@Mock({ of: InboxCoreService })
export class InboxCoreServiceMock extends InboxServiceMock {
    @Stub() set: jasmine.Spy;
}
