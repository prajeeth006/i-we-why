import { Mock } from 'moxxi';
import { Subject } from 'rxjs';

import { CssOverridesConfig } from '../src/css-overrides.client-config';

@Mock({ of: CssOverridesConfig })
export class CssOverridesConfigMock extends CssOverridesConfig {
    override whenReady = new Subject<void>();
}
