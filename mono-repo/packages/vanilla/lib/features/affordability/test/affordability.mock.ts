import { Mock, Stub } from 'moxxi';
import { BehaviorSubject } from 'rxjs';

import { AffordabilitySnapshotDetails } from '../src/affordability.models';
import { AffordabilityService } from '../src/affordability.service';

@Mock({ of: AffordabilityService })
export class AffordabilityServiceMock {
    snapshotDetails = new BehaviorSubject<AffordabilitySnapshotDetails | null>(null);

    @Stub() load: jasmine.Spy;
}
