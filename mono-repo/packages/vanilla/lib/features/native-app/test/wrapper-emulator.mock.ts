import { NativeEvent } from '@frontend/vanilla/core';
import { Mock, Stub } from 'moxxi';
import { Subject } from 'rxjs';

import { WrapperEmulatorService } from '../src/wrapper-emulator.service';

@Mock({ of: WrapperEmulatorService })
export class WrapperEmulatorServiceMock {
    @Stub() emulateMessageToWeb: jasmine.Spy;
    @Stub() initialize: jasmine.Spy;
    eventsToNative = new Subject<NativeEvent>();
}
