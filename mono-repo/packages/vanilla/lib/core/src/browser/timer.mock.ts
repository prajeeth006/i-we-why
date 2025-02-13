import { Mock, Stub } from 'moxxi';

import { TimerService } from './timer.service';

@Mock({ of: TimerService })
export class TimerServiceMock {
    @Stub() setIntervalOutsideAngularZone: jasmine.Spy;
    @Stub() setTimeoutOutsideAngularZone: jasmine.Spy;
    @Stub() scheduleIdleCallback: jasmine.Spy;
    @Stub() setInterval: jasmine.Spy;
    @Stub() setTimeout: jasmine.Spy;
    @Stub() clearInterval: jasmine.Spy;
    @Stub() clearTimeout: jasmine.Spy;

    constructor() {
        this.setIntervalOutsideAngularZone.and.callFake((op: Function, timeout: number) => {
            setInterval(op, timeout);
        });
        this.setTimeoutOutsideAngularZone.and.callFake((op: Function, timeout: number) => {
            setTimeout(op, timeout);
        });
        this.setInterval.and.callFake((op: Function, timeout: number) => {
            setInterval(op, timeout);
        });
        this.setTimeout.and.callFake((op: Function, timeout: number) => {
            setTimeout(op, timeout);
        });

        this.clearInterval.and.callFake((i: number) => clearInterval(i));
        this.clearTimeout.and.callFake((i: number) => clearTimeout(i));
    }
}
