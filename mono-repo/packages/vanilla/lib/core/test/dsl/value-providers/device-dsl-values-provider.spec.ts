import { TestBed } from '@angular/core/testing';

import { DslRecordable, DslRecorderService } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { DeviceDslValuesProvider } from '../../../src/dsl/value-providers/device-dsl-values-provider';
import { DeviceServiceMock } from '../../browser/device.mock';

describe('DeviceDslValuesProvider', () => {
    let target: DslRecordable;
    let deviceServiceMock: DeviceServiceMock;

    beforeEach(() => {
        deviceServiceMock = MockContext.useMock(DeviceServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, DslRecorderService, DeviceDslValuesProvider],
        });

        deviceServiceMock.isAndroid = false;
        deviceServiceMock.isiOS = false;
        deviceServiceMock.isMobile = false;
        deviceServiceMock.isMobilePhone = false;
        deviceServiceMock.isRobot = false;
        deviceServiceMock.isTablet = false;
        deviceServiceMock.isTouch = false;
        deviceServiceMock.model = 'old';
        deviceServiceMock.osName = 'space';
        deviceServiceMock.osVersion = 'v1.0';
        deviceServiceMock.vendor = 'vend';
        deviceServiceMock.getCapability.withArgs('agent').and.returnValue('007');
        deviceServiceMock.getCapability.withArgs('user').and.returnValue('Bond');

        const provider = TestBed.inject(DeviceDslValuesProvider);
        TestBed.inject(DslRecorderService).beginRecording();

        target = provider.getProviders()['Device']!;
    });

    describe('Device', () => {
        it('should return values', () => {
            expect(target['IsAndroid']).toBeFalse();
            expect(target['IsIOS']).toBeFalse();
            expect(target['IsMobile']).toBeFalse();
            expect(target['IsMobilePhone']).toBeFalse();
            expect(target['IsRobot']).toBeFalse();
            expect(target['IsTablet']).toBeFalse();
            expect(target['IsTouch']).toBeFalse();
            expect(target['Model']).toBe('old');
            expect(target['OSName']).toBe('space');
            expect(target['OSVersion']).toBe('v1.0');
            expect(target['Vendor']).toBe('vend');
            expect(target['GetCapability']('agent')).toBe('007');
            expect(target['GetCapability']('user')).toBe('Bond');
        });
    });
});
