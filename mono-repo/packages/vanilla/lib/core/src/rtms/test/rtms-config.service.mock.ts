import { Mock, Stub } from 'moxxi';

import { RtmsConfigService } from '../rtms-config.service';

@Mock({ of: RtmsConfigService })
export class RtmsConfigServiceMock {
    @Stub() params: jasmine.Spy;
}
