import { TestBed } from '@angular/core/testing';

import { DslRecordable, DslRecorderService } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { DslCacheServiceMock } from '../../../core/test/dsl/dsl-cache.mock';
import { PersistentDslServiceMock } from '../../../core/test/dsl/dsl.mock';
import { UserScrubDslValuesProvider } from '../src/user-scrub-dsl-values-provider';
import { UserScrubServiceMock } from './user-scrub.mock';

describe('UserScrubDslValuesProvider', () => {
    let target: DslRecordable;
    let persistentDslServiceMock: PersistentDslServiceMock;

    beforeEach(() => {
        MockContext.useMock(UserScrubServiceMock);
        MockContext.useMock(DslCacheServiceMock);
        persistentDslServiceMock = MockContext.useMock(PersistentDslServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, DslRecorderService, UserScrubDslValuesProvider],
        });

        const provider = TestBed.inject(UserScrubDslValuesProvider);
        TestBed.inject(DslRecorderService).beginRecording();
        target = provider.getProviders()['UserScrub']!;
    });

    describe('UserScrub', () => {
        it('should forward from persistent service', () => {
            persistentDslServiceMock.getResult.and.returnValue(true);
            expect(target['IsScrubbedFor']('casino')).toBeTrue();
        });
    });
});
