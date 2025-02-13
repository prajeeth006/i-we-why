import { KeyValue, OffersResourceService, OffersService } from '@frontend/vanilla/shared/offers';
import { Mock, Stub, StubObservable } from 'moxxi';
import { Subject } from 'rxjs';

import { OffersConfig } from '../../../features/offers/src/offers.client-config';

@Mock({ of: OffersResourceService })
export class OffersResourceServiceMock {
    @StubObservable() getCount: jasmine.ObservableSpy;
    @StubObservable() getStatus: jasmine.ObservableSpy;
    @StubObservable() updateStatus: jasmine.ObservableSpy;
}

@Mock({ of: OffersService })
export class OffersServiceMock {
    counts = new Subject<KeyValue[]>();
    @Stub() getCount: jasmine.Spy;
    @Stub() initPolling: jasmine.Spy;
    @Stub() stopPolling: jasmine.Spy;
}

@Mock({ of: OffersConfig })
export class OffersConfigMock extends OffersConfig {
    override whenReady = new Subject<void>();
}
