import { Location } from '@angular/common';

import { Mock, Stub } from 'moxxi';

@Mock({ of: Location })
export class LocationMock {
    @Stub() path: jasmine.Spy;
    @Stub() go: jasmine.Spy;
    @Stub() replaceState: jasmine.Spy;
    @Stub() subscribe: jasmine.Spy;
}
