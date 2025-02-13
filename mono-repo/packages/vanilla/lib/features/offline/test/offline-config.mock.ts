import { Mock } from 'moxxi';
import { Subject } from 'rxjs';

import { OfflineConfig } from '../../../features/offline/src/offline.client-config';

@Mock({ of: OfflineConfig })
export class OfflineConfigMock extends OfflineConfig {
    override whenReady = new Subject<void>();
    constructor() {
        super();

        this.content = {};
    }
}
