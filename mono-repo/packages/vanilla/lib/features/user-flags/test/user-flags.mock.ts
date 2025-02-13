import { Mock, Stub } from 'moxxi';
import { ReplaySubject } from 'rxjs';

import { UserFlag } from '../src/user-flags.models';
import { UserFlagsService } from '../src/user-flags.service';

@Mock({ of: UserFlagsService })
export class UserFlagsServiceMock {
    flags = new ReplaySubject<UserFlag[]>(1);

    @Stub() load: jasmine.Spy;
}
