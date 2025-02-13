import { Mock } from 'moxxi';
import { Subject } from 'rxjs';

import { LoginConfig } from '../src/login.client-config';

@Mock({ of: LoginConfig })
export class LoginConfigMock extends LoginConfig {
    override whenReady = new Subject<void>();
}
