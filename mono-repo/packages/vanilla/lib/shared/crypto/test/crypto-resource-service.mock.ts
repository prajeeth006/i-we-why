import { Mock, StubObservable } from 'moxxi';

import { CryptoResourceService } from '../src/crypto-resource.service';

@Mock({ of: CryptoResourceService })
export class CryptoResourceServiceMock {
    @StubObservable() encrypt: jasmine.ObservableSpy;
    @StubObservable() decrypt: jasmine.ObservableSpy;
}
