import { Mock, Stub } from 'moxxi';
import { BehaviorSubject } from 'rxjs';

import { MlifeLoyalityProfile } from '../src/loyality-profile.models';
import { LoyalityProfileService } from '../src/loyality-profile.service';

@Mock({ of: LoyalityProfileService })
export class LoyalityProfileServiceMock {
    mlifeLoyalityProfile = new BehaviorSubject<MlifeLoyalityProfile | null>(null);
    @Stub() load: jasmine.Spy;
    @Stub() refresh: jasmine.Spy;
}
