import { Mock, Stub } from 'moxxi';
import { BehaviorSubject } from 'rxjs';

import { MohDetails, MohDetailsService } from '../src/moh-details.service';

@Mock({ of: MohDetailsService })
export class MohDetailsServiceMock {
    details = new BehaviorSubject<MohDetails | null>(null);

    @Stub() refresh: jasmine.Spy;
}
