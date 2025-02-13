import { Mock, Stub } from 'moxxi';

import { DatePickerService } from '../src/datepicker.service';

@Mock({ of: DatePickerService })
export class DatePickerServiceMock {
    mobileMode: boolean;
    @Stub() formatModel: jasmine.Spy;
    @Stub() parseDate: jasmine.Spy;
}
