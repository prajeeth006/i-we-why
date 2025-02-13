import { Mock } from 'moxxi';
import { Subject } from 'rxjs';

import { ConfirmPasswordConfig } from '../src/confirm-password.client-config';

@Mock({ of: ConfirmPasswordConfig })
export class ConfirmPasswordConfigMock extends ConfirmPasswordConfig {
    override whenReady = new Subject<void>();
}
