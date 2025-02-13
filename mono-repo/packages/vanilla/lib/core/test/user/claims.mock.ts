import { Mock, Stub } from 'moxxi';

import { ClaimsService } from '../../src/user/claims.service';

@Mock({ of: ClaimsService })
export class ClaimsServiceMock {
    @Stub() get: jasmine.Spy;
    @Stub() generateShortNames: jasmine.Spy;
}
