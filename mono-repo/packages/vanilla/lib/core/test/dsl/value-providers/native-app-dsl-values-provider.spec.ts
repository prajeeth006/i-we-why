import { TestBed } from '@angular/core/testing';

import { DslRecordable, DslRecorderService } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { NativeApplicationDslValuesProvider } from '../../../src/dsl/value-providers/native-app-dsl-values-provider';
import { NativeAppServiceMock } from '../../native-app/native-app.mock';

describe('NativeApplicationDslValuesProvider', () => {
    let target: DslRecordable;

    beforeEach(() => {
        MockContext.useMock(NativeAppServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, DslRecorderService, NativeApplicationDslValuesProvider],
        });

        const provider = TestBed.inject(NativeApplicationDslValuesProvider);
        TestBed.inject(DslRecorderService).beginRecording();

        target = provider.getProviders()['NativeApplication']!;
    });

    describe('NativeApplication', () => {
        it('should return values', () => {
            expect(target['IsDownloadClient']).toBeFalse();
            expect(target['IsDownloadClientApp']).toBeFalse();
            expect(target['IsDownloadClientWrapper']).toBeFalse();
            expect(target['IsNative']).toBeFalse();
            expect(target['IsNativeApp']).toBeFalse();
            expect(target['IsNativeWrapper']).toBeFalse();
            expect(target['IsTerminal']).toBeFalse();
            expect(target['Name']).toBe('unknown');
            expect(target['Product']).toBe('UNKNOWN');
        });
    });
});
