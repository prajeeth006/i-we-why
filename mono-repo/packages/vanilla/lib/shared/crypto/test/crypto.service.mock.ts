import { Mock, StubObservable } from 'moxxi';

import { CryptoService } from '../../crypto';

@Mock({ of: CryptoService })
export class CryptoServiceMock {
    @StubObservable() encrypt: jasmine.ObservableSpy;
    @StubObservable() decrypt: jasmine.ObservableSpy;
}
