import { TestBed } from '@angular/core/testing';

import { DslRecordable, DslRecorderService } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { EpcotDslValuesProvider } from '../../../src/dsl/value-providers/epcot-dsl-values-provider';
import { PageMock } from '../../browsercommon/page.mock';

describe('EpcotDslValuesProvider', () => {
    let target: DslRecordable;
    let pageMock: PageMock;

    beforeEach(() => {
        pageMock = MockContext.useMock(PageMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, DslRecorderService, EpcotDslValuesProvider],
        });

        const provider = TestBed.inject(EpcotDslValuesProvider);
        TestBed.inject(DslRecorderService).beginRecording();
        target = provider.getProviders()['Epcot']!;
    });

    describe('IsEnabled', () => {
        it('should return true', () => {
            pageMock.epcot = {
                accountMenuVersion: 4,
                headerVersion: 2,
            };

            expect(target['IsEnabled']('accountMenu')).toBeTrue();
            expect(target['IsEnabled']('Header')).toBeTrue();
        });

        it('should return false', () => {
            pageMock.epcot = {
                accountMenuVersion: 3,
                headerVersion: 1,
            };

            expect(target['IsEnabled']('accountMenu')).toBeFalse();
            expect(target['IsEnabled']('Header')).toBeFalse();
            expect(target['IsEnabled']('navigation')).toBeFalse();
        });
    });
});
