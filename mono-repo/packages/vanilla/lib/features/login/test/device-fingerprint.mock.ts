import { DeviceFingerprintService } from '@frontend/vanilla/core';
import { Mock, Stub } from 'moxxi';

@Mock({ of: DeviceFingerprintService })
export class DeviceFingerprintServiceMock {
    @Stub() get: jasmine.Spy;
    @Stub() storeDeviceDetails: jasmine.Spy;
}
