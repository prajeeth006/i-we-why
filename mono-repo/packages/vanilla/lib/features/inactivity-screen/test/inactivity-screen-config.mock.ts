import { Mock } from 'moxxi';
import { Subject } from 'rxjs';

import { InactivityScreenConfig } from '../src/inactivity-screen.client-config';
import { InactivityMode } from '../src/inactivity-screen.models';

@Mock({ of: InactivityScreenConfig })
export class InactivityScreenConfigMock extends InactivityScreenConfig {
    override whenReady = new Subject<void>();

    constructor() {
        super();
        this.mode = InactivityMode.Betstation;
        this.idleTimeout = 600;
        this.countdownTimeout = 7;
    }
}
