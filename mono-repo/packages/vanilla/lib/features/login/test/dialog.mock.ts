import { MatDialog } from '@angular/material/dialog';

import { Mock, Stub } from 'moxxi';

@Mock({ of: MatDialog })
export class MatDialogMock {
    @Stub() open: jasmine.Spy;
}
