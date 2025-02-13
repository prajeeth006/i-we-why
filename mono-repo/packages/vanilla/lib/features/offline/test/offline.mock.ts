import { Mock, Stub } from 'moxxi';

import { OfflineService } from '../../../features/offline/src/offline.service';

@Mock({ of: OfflineService })
export class OfflineServiceMock {
    @Stub() showOverlay: jasmine.Spy;
}
