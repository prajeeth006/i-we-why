import { Mock, StubObservable } from 'moxxi';
import { Subject } from 'rxjs';

import { InactivityScreenService } from '../src/inactivity-screen.service';

@Mock({ of: InactivityScreenService })
export class InactivityScreenServiceMock {
    activity: Subject<any> = new Subject<any>();
    @StubObservable() whenIdle: jasmine.ObservableSpy;
}
