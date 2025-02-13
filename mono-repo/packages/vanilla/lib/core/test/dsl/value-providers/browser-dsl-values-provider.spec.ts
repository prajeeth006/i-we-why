import { TestBed } from '@angular/core/testing';

import { DslRecorderService } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { BrowserDslValuesProvider } from '../../../src/dsl/value-providers/browser-dsl-values-provider';
import { DeviceServiceMock } from '../../browser/device.mock';
import { PWAServiceMock } from '../../browser/pwa.mock';

describe('BrowserDslValuesProvider', () => {
    let provider: BrowserDslValuesProvider;
    let pwaServiceMock: PWAServiceMock;
    let deviceServiceMock: DeviceServiceMock;

    beforeEach(() => {
        pwaServiceMock = MockContext.useMock(PWAServiceMock);
        deviceServiceMock = MockContext.useMock(DeviceServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, DslRecorderService, BrowserDslValuesProvider],
        });

        deviceServiceMock.getCapability.withArgs('browserName').and.returnValue('BondBrowser');
        deviceServiceMock.getCapability.withArgs('browserVersion').and.returnValue('7.01.02');

        provider = TestBed.inject(BrowserDslValuesProvider);
        TestBed.inject(DslRecorderService).beginRecording();
    });

    describe('Browser', () => {
        it('should return browser name', () => {
            const value = provider.getProviders()['Browser']!['Name'];

            expect(value).toBe('BondBrowser');
        });

        it('should return browser version', () => {
            const value = provider.getProviders()['Browser']!['Version'];

            expect(value).toBe('7.01.02');
        });

        it('should return major version', () => {
            const value = provider.getProviders()['Browser']!['MajorVersion'];

            expect(value).toBe(7);
        });

        it('IsStandaloneApp should return a true if query matches', () => {
            pwaServiceMock.isStandaloneApp = true;

            const value = provider.getProviders()['Browser']!['IsStandaloneApp'];

            expect(value).toBeTrue();
        });
    });
});
