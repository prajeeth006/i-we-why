import { Mock, Stub } from 'moxxi';

import { SingleSignOnService } from '../src/single-sign-on.service';

@Mock({ of: SingleSignOnService })
export class SingleSignOnServiceMock {
    @Stub() setSsoToken: jasmine.Spy;
}
