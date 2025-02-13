import { Mock } from 'moxxi';
import { Subject } from 'rxjs';

import { LoginDurationConfig } from '../src/login-duration.client-config';

@Mock({ of: LoginDurationConfig })
export class LoginDurationConfigMock extends LoginDurationConfig {
    override whenReady = new Subject<void>();

    constructor() {
        super();

        this.text = 'Login duration: {duration}';
    }
}
