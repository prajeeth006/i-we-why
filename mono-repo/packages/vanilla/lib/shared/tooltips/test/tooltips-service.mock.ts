import { Mock, Stub } from 'moxxi';
import { BehaviorSubject } from 'rxjs';

import { Tooltip, TooltipsService } from '../src/tooltips.service';

@Mock({ of: TooltipsService })
export class TooltipsServiceMock {
    activeTooltip = new BehaviorSubject<Tooltip | null>(null);
    @Stub() getTooltip: jasmine.Spy;
    @Stub() nextTooltip: jasmine.Spy;
    @Stub() previousTooltip: jasmine.Spy;
    @Stub() hasNext: jasmine.Spy;
    @Stub() hasPrevious: jasmine.Spy;
    @Stub() closeTooltip: jasmine.Spy;
    @Stub() show: jasmine.Spy;
    @Stub() addTooltip: jasmine.Spy;
    @Stub() removeTooltip: jasmine.Spy;
}
