import { MockService } from 'ng-mocks';
import { Subject } from 'rxjs';

import { TrackingConfig } from '../../src/tracking.client-config';

export const TrackingConfigMock = MockService(TrackingConfig, {
    isEnabled: true,
    whenReady: new Subject<void>(),
    dataLayerName: 'testDataLayer',
    dataLayerUpdateTimeoutInMilliseconds: 0,
    eventCallbackTimeoutInMilliseconds: 100,
    tagManagerRenderers: ['GoogleTagManagerRenderer', 'DummyTagRenderer'],
    notTrackedQueryStrings: ['sessionKey', 'secretQuery'],
});
