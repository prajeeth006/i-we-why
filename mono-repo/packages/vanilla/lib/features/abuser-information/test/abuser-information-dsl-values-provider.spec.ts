import { TestBed } from '@angular/core/testing';

import { DslRecordable, DslRecorderService } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { DslCacheServiceMock } from '../../../core/test/dsl/dsl-cache.mock';
import { PersistentDslServiceMock } from '../../../core/test/dsl/dsl.mock';
import { AbuserInformationDslValuesProvider } from '../src/abuser-information-dsl-values-provider';
import { AbuserInformationServiceMock } from './abuser-information-service.mock';

describe('AbuserInformationDslValuesProvider', () => {
    let target: DslRecordable;
    let persistentDslService: PersistentDslServiceMock;

    beforeEach(() => {
        MockContext.useMock(AbuserInformationServiceMock);
        MockContext.useMock(DslCacheServiceMock);
        persistentDslService = MockContext.useMock(PersistentDslServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, DslRecorderService, AbuserInformationDslValuesProvider],
        });

        const provider = TestBed.inject(AbuserInformationDslValuesProvider);
        TestBed.inject(DslRecorderService).beginRecording();
        target = provider.getProviders()['BonusAbuserInformation']!;
    });

    describe('BonusAbuserInformation', () => {
        it('should forward from persistent service', () => {
            persistentDslService.getResult.and.returnValue(true);
            expect(target['IsBonusAbuser']).toBeTrue();
        });
    });
});
