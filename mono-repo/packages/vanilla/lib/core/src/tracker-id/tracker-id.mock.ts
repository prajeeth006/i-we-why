import { Mock, Stub } from 'moxxi';

import { TrackerIdService } from './tracker-id.service';

@Mock({ of: TrackerIdService })
export class TrackerIdServiceMock {
    @Stub() get: jasmine.Spy;
}
