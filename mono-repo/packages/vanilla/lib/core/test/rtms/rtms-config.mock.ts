import { RtmsLayerConfig } from '@frontend/vanilla/shared/rtms';
import { Mock } from 'moxxi';

import { RtmsConfig } from '../../src/rtms/rtms.client-config';

@Mock({ of: RtmsConfig })
export class RtmsConfigMock extends RtmsConfig {
    constructor() {
        super();
        this.isEnabled = true;
        this.host = 'https://rtms.bwin.com/gateway';
        this.keepAliveMilliseconds = 5000;
        this.reconnectMilliseconds = 15000;
        this.disabledEvents = { test_event: 'true' };
        this.remoteLogLevels = [];
        this.backgroundEvents = [];
    }
}

@Mock({ of: RtmsLayerConfig })
export class RtmsLayerConfigMock extends RtmsLayerConfig {}
