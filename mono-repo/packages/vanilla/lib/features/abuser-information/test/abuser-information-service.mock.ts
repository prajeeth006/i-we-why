import { Mock, Stub } from 'moxxi';
import { BehaviorSubject } from 'rxjs';

import { AbuserInformation } from '../src/abuser-information.models';
import { AbuserInformationService } from '../src/abuser-information.service';

@Mock({ of: AbuserInformationService })
export class AbuserInformationServiceMock {
    abuserInformation = new BehaviorSubject<AbuserInformation | null>(null);
    @Stub() load: jasmine.Spy;
}
