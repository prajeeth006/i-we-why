import { Mock, Stub } from 'moxxi';
import { BehaviorSubject } from 'rxjs';

import { CurfewStatus, CurfewStatusService } from '../src/curfew-status.service';

@Mock({ of: CurfewStatusService })
export class CurfewStatusServiceMock {
    curfewStatuses = new BehaviorSubject<CurfewStatus | null>(null);
    @Stub() load: jasmine.Spy;
}
