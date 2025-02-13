import { IdleService } from '@frontend/vanilla/shared/idle';
import { Mock, Stub, StubObservable } from 'moxxi';
import { Subject } from 'rxjs';

@Mock({ of: IdleService })
export class IdleServiceMock {
    @Stub() init: jasmine.Spy;
    @StubObservable() whenIdle: jasmine.ObservableSpy;
    activity: Subject<any> = new Subject<any>();
}
