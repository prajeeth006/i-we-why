import { Mock, Stub } from 'moxxi';

import { RtmsLogService } from '../rtms-log.service';

@Mock({ of: RtmsLogService })
export class RtmsLogServiceMock {
    @Stub() debug: jasmine.Spy;
    @Stub() info: jasmine.Spy;
    @Stub() warn: jasmine.Spy;
    @Stub() error: jasmine.Spy;
}
