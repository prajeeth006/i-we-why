import { Mock, Stub, StubPromise } from 'moxxi';
import { Subject } from 'rxjs';

import { WrapperSettings, WrapperSettingsService } from '../src/wrapper-settings.service';

@Mock({ of: WrapperSettingsService })
export class WrapperSettingsServiceMock {
    current: WrapperSettings = <WrapperSettings>{
        keepMeSignedInEnabled: false,
        sliderGamesEnabled: false,
        deviceFaceSupported: false,
        deviceTouchSupported: false,
    };
    @StubPromise() load: jasmine.PromiseSpy;
    @Stub() update: jasmine.Spy;
    applicationSettingsFired = new Subject<boolean>();
}
