import { Mock, Stub } from 'moxxi';
import { BehaviorSubject } from 'rxjs';

import { RegistrationInformation } from '../src/registration.models';
import { RegistrationService } from '../src/registration.service';

@Mock({ of: RegistrationService })
export class RegistrationServiceMock {
    registrationInformation = new BehaviorSubject<RegistrationInformation | null>(null);

    @Stub() load: jasmine.Spy;
}
