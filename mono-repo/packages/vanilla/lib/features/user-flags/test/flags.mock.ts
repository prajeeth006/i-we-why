import { FlagsService } from '@frontend/vanilla/features/flags';
import { Mock, StubObservable } from 'moxxi';
import { BehaviorSubject } from 'rxjs';

@Mock({ of: FlagsService })
export class FlagsServiceMock {
    available: BehaviorSubject<{ [key: string]: string | null }> = new BehaviorSubject({});
    @StubObservable() find: jasmine.ObservableSpy;
}
