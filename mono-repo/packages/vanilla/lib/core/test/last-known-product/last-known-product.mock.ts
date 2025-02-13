import { LastKnownProduct, LastKnownProductService } from '@frontend/vanilla/core';
import { Mock, Stub } from 'moxxi';
import { Subject } from 'rxjs';

@Mock({ of: LastKnownProductService })
export class LastKnownProductServiceMock {
    update = new Subject<LastKnownProduct>();
    @Stub() add: jasmine.Spy;
    @Stub() get: jasmine.Spy;
}
