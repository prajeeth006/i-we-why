import { Mock, StubObservable } from 'moxxi';

import { BonusResourceService } from '../../src/bonus-resource.service';

@Mock({ of: BonusResourceService })
export class BonusResourceServiceMock {
    @StubObservable() updateBonusTncAcceptance: jasmine.ObservableSpy;
    @StubObservable() dropBonusOffer: jasmine.ObservableSpy;
}
