import { DateTimeService } from '@frontend/vanilla/core';
import { Mock, Stub } from 'moxxi';

@Mock({ of: DateTimeService })
export class DateTimeServiceMock {
    @Stub() now: jasmine.Spy;
    @Stub() convertLocalToUserTimezone: jasmine.Spy;
    @Stub() userTimezoneUtcOffsetTotalSeconds: jasmine.Spy;
}
