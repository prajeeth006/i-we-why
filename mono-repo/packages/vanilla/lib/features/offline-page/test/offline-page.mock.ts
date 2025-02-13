import { Mock } from 'moxxi';
import { Subject } from 'rxjs';

import { OfflinePageConfig } from '../../../features/offline-page/src/offline-page.client-config';

@Mock({ of: OfflinePageConfig })
export class OfflinePageConfigMock extends OfflinePageConfig {
    override whenReady = new Subject<void>();
}
