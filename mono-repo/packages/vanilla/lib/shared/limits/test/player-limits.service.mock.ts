import { PlayerLimitsService } from '@frontend/vanilla/shared/limits';
import { Mock, Stub, StubObservable } from 'moxxi';

@Mock({ of: PlayerLimitsService })
export class PlayerLimitsServiceMock {
    @StubObservable() getLimits: jasmine.ObservableSpy;
    @Stub() refresh: jasmine.Spy;
    @StubObservable() get: jasmine.ObservableSpy;
}
