import { Mock, Stub } from 'moxxi';

import { UserServiceCore } from '../user-core.service';

@Mock({ of: UserServiceCore })
export class UserServiceCoreMock {
    @Stub() notify: jasmine.Spy;
}
