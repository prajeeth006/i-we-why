import { Mock } from 'moxxi';
import { Subject } from 'rxjs';

import { RtmsEventsConfig } from '../src/rtms-events-processor.client-config';

@Mock({ of: RtmsEventsConfig })
export class RtmsEventsConfigMock extends RtmsEventsConfig {
    override whenReady = new Subject<void>();
}
