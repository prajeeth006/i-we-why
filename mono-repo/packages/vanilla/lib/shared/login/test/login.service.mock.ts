import { Mock, Stub } from 'moxxi';

import { LoginService } from '../src/login.service';

@Mock({ of: LoginService })
export class LoginServiceMock {
    @Stub() runAfterLogin: jasmine.ObservableSpy;
}
