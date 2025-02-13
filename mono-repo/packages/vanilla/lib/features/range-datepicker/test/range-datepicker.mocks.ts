import { Mock, Stub, StubObservable } from 'moxxi';
import { Subject } from 'rxjs';

import { RangeDatepickerOverlayService } from '../src/range-datepicker-overlay.service';
import { RangeDatepickerConfig } from '../src/range-datepicker.client-config';
import { RangeDatepickerService } from '../src/range-datepicker.service';

@Mock({ of: RangeDatepickerConfig })
export class RangeDatepickerConfigMock extends RangeDatepickerConfig {
    override whenReady = new Subject<void>();
}

@Mock({ of: RangeDatepickerService })
export class RangeDatepickerServiceMock {
    @Stub() apply: jasmine.Spy;
    @Stub() close: jasmine.Spy;
    @StubObservable() onApply: jasmine.Spy;
    @StubObservable() onClose: jasmine.Spy;
}

@Mock({ of: RangeDatepickerOverlayService })
export class RangeDatepickerOverlayServiceMock {
    @Stub() toggleRangeDatepicker: jasmine.Spy;
}
