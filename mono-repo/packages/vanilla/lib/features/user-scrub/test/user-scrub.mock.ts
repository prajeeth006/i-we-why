import { Mock, Stub } from 'moxxi';
import { BehaviorSubject } from 'rxjs';

import { UserScrubService } from '../src/user-scrub.service';

@Mock({ of: UserScrubService })
export class UserScrubServiceMock {
    products = new BehaviorSubject<string[] | null>(null);
    @Stub() load: jasmine.Spy;
}
