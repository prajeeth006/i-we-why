import { Mock, Stub } from 'moxxi';

import { DebounceButtonsService } from '../src/debounce-buttons.service';

@Mock({ of: DebounceButtonsService })
export class DebounceButtonsServiceMock {
    @Stub() init: jasmine.Spy;
}
