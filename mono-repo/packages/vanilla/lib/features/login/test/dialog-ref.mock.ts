import { MatDialogRef } from '@angular/material/dialog';

import { Mock, Stub, StubObservable } from 'moxxi';

@Mock({ of: MatDialogRef })
export class MatDialogRefMock {
    disableClose: boolean;
    @Stub() close: jasmine.Spy;
    @StubObservable() afterClosed: jasmine.ObservableSpy;
}
