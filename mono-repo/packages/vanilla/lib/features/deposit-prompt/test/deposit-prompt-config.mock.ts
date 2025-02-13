import { Mock } from 'moxxi';
import { Subject } from 'rxjs';

import { DepositPromptConfig } from '../src/deposit-prompt.client-config';

@Mock({ of: DepositPromptConfig })
export class DepositPromptConfigMock extends DepositPromptConfig {
    override whenReady = new Subject<void>();
}
