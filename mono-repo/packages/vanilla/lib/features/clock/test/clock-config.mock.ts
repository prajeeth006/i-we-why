import { Mock } from 'moxxi';
import { Subject } from 'rxjs';

import { ClockConfig } from '../src/clock.client-config';

@Mock({ of: ClockConfig })
export class ClockConfigMock extends ClockConfig {
    override whenReady = new Subject<void>();
    constructor() {
        super();
        this.slotName;
        this.dateTimeFormat = 'mediumTime';
    }
}
