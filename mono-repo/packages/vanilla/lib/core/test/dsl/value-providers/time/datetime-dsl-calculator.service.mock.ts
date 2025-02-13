import { Mock, Stub } from 'moxxi';

import { DateTimeDslCalculatorService } from '../../../../../core/src/dsl/value-providers/time/datetime-dsl-calculator.service';

@Mock({ of: DateTimeDslCalculatorService })
export class DateTimeDslCalculatorServiceMock {
    @Stub() getTime: jasmine.Spy;
    @Stub() getDate: jasmine.Spy;
    @Stub() getTimeOfDay: jasmine.Spy;
    @Stub() getDayOfWeek: jasmine.Spy;
    @Stub() createTime: jasmine.Spy;
    @Stub() createTimeOfDay: jasmine.Spy;
}
