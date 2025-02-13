import { signal } from '@angular/core';

import { Mock, Stub } from 'moxxi';
import { BehaviorSubject, Subject } from 'rxjs';

import { SofStatusDetails, SofStatusDetailsCoreService } from '../../../core/src/lazy/service-providers/sof-status-details-core.service';
import { SofStatusDetailsService } from '../src/sof-status-details.service';

@Mock({ of: SofStatusDetailsService })
export class SofStatusDetailsServiceMock {
    sofStatusDetails = signal<SofStatusDetails | null>(null);
    statusDetails = new BehaviorSubject<SofStatusDetails | null>(null);

    @Stub() refresh: jasmine.Spy;
}

@Mock({ of: SofStatusDetailsCoreService })
export class SofStatusDetailsCoreServiceMock {
    whenReady: Subject<void> = new Subject();
    statusDetails = new BehaviorSubject<SofStatusDetails | null>(null);
    @Stub() refresh: jasmine.Spy;
}
