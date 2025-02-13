import { Mock, Stub } from 'moxxi';

import { ConfirmPopupService } from '../src/confirm-popup.service';

@Mock({ of: ConfirmPopupService })
export class ConfirmPopupServiceMock {
    @Stub() show: jasmine.Spy;
}
