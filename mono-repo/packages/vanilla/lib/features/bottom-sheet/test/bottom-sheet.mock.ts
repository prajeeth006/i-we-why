import { Mock, Stub } from 'moxxi';
import { Subject } from 'rxjs';

import { BottomSheetOverlayService } from '../src/bottom-sheet-overlay.service';
import { BottomSheetConfig } from '../src/bottom-sheet.client-config';
import { BottomSheetService } from '../src/bottom-sheet.service';

@Mock({ of: BottomSheetService })
export class BottomSheetServiceMock {
    @Stub() setItemCounter: jasmine.Spy;
    @Stub() setBottomSheetComponent: jasmine.Spy;
    @Stub() getBottomSheetComponent: jasmine.Spy;
}

@Mock({ of: BottomSheetOverlayService })
export class BottomSheetOverlayServiceMock {
    @Stub() toggle: jasmine.Spy;
}

@Mock({ of: BottomSheetConfig })
export class BottomSheetConfigMock extends BottomSheetConfig {
    override whenReady = new Subject<void>();
    constructor() {
        super();

        this.menu = [
            { name: 'sports', url: 'http://sports', text: 'Sportsbook' },
            { name: 'testweb', url: 'http://testweb', text: 'Vanilla Testweb' },
        ] as any;
    }
}
