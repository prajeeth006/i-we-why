import { TestBed } from '@angular/core/testing';

import { NativeEventType } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { NativeAppServiceMock } from '../../../core/test/native-app/native-app.mock';
import { BetstationHardwareFaultBootstrapService } from '../src/betstation-hardware-fault-bootstrap.service';
import { BetstationHardwareFaultConfigMock, BetstationHardwareFaultServiceMock } from './betstation-hardware-fault.mocks';

describe('BetstationHardwareFaultBootstrapService', () => {
    let service: BetstationHardwareFaultBootstrapService;
    let config: BetstationHardwareFaultConfigMock;
    let betstationHardwareFaultService: BetstationHardwareFaultServiceMock;
    let nativeAppServiceMock: NativeAppServiceMock;

    beforeEach(() => {
        config = MockContext.useMock(BetstationHardwareFaultConfigMock);
        nativeAppServiceMock = MockContext.useMock(NativeAppServiceMock);
        betstationHardwareFaultService = MockContext.useMock(BetstationHardwareFaultServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, BetstationHardwareFaultBootstrapService],
        });

        config.isEnabled = true;
        service = TestBed.inject(BetstationHardwareFaultBootstrapService);
    });

    describe('on eventsFromNative', () => {
        it('show overlay when receiving DEVICE_FAILURE', () => {
            service.onFeatureInit();
            config.whenReady.next();

            nativeAppServiceMock.eventsFromNative.next({ eventName: NativeEventType.DEVICE_FAILURE, parameters: { errorCode: 'code' } });

            expect(betstationHardwareFaultService.showOverlay).toHaveBeenCalledWith('code');
        });
        it('Close overlay when receiving DEVICE_FIXED', () => {
            service.onFeatureInit();
            config.whenReady.next();

            nativeAppServiceMock.eventsFromNative.next({ eventName: NativeEventType.DEVICE_FIXED, parameters: { errorCode: 'code' } });

            expect(betstationHardwareFaultService.closeOverlay).toHaveBeenCalledWith('code');
        });
    });
});
