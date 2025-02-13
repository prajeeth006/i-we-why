import { Mock } from 'moxxi';
import { Subject } from 'rxjs';

import { DebounceButtonsConfig } from '../src/debounce-buttons.client-config';

@Mock({ of: DebounceButtonsConfig })
export class DebounceButtonsConfigMock extends DebounceButtonsConfig {
    override whenReady = new Subject<void>();
}
