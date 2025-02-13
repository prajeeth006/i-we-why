import { MENU_COUNTERS_PROVIDER, MenuCountersService } from '@frontend/vanilla/core';
import { Mock, Stub } from 'moxxi';

@Mock({ of: MenuCountersService })
export class MenuCountersServiceMock {
    @Stub() update: jasmine.Spy;
    @Stub() registerProviders: jasmine.Spy;
}

@Mock({ of: MENU_COUNTERS_PROVIDER })
export class MenuCounterProviderMock {
    @Stub() setCounters: jasmine.Spy;
}
