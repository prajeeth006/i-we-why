import { BrowserPerformanceService } from '@frontend/vanilla/core';
import { Mock, Stub, StubObservable } from 'moxxi';

@Mock({ of: BrowserPerformanceService })
export class BrowserPerformanceServiceMock {
    isSupported: boolean;
    @StubObservable() loadProfile: jasmine.ObservableSpy;
    @Stub() startMeasurement: jasmine.Spy;
    @Stub() endMeasurement: jasmine.Spy;
    @Stub() clearMeasurement: jasmine.Spy;
    @StubObservable() observeMeasurement: jasmine.ObservableSpy;
}
