import { Mock } from 'moxxi';
import { Subject } from 'rxjs';

import { PrerenderConfig } from '../src/prerender.client-config';

@Mock({ of: PrerenderConfig })
export class PrerenderConfigMock extends PrerenderConfig {
    override whenReady = new Subject<void>();
}
