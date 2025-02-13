import { ClockService, DateTimeOffset, TimeSpan } from '@frontend/vanilla/core';
import { Mock, Stub } from 'moxxi';

@Mock({ of: ClockService })
export class ClockServiceMock {
    utcNow = new DateTimeOffset(1591096796988, TimeSpan.ZERO);
    userLocalNow = new DateTimeOffset(1577108614471, TimeSpan.fromHours(1.75));
    userTimeZoneOffset = TimeSpan.fromHours(3.75);
    @Stub() toTotalTimeStringFormat: jasmine.Spy;
}
