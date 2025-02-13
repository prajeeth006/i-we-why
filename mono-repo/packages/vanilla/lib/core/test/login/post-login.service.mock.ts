import { Mock, Stub } from 'moxxi';

import { PostLoginService } from '../../src/login/post-login.service';

@Mock({ of: PostLoginService })
export class PostLoginServiceMock {
    @Stub() sendPostLoginEvent: jasmine.Spy;
}
