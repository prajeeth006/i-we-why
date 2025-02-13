import { signal } from '@angular/core';

import { KycStatus, KycStatusService } from '@frontend/vanilla/shared/kyc';
import { Mock, Stub } from 'moxxi';
import { BehaviorSubject } from 'rxjs';

@Mock({ of: KycStatusService })
export class KycStatusServiceMock {
    status = signal<KycStatus | null>(null);
    kycStatus = new BehaviorSubject<KycStatus | null>(null);

    @Stub() refresh: jasmine.Spy;
    current: KycStatus;
}
