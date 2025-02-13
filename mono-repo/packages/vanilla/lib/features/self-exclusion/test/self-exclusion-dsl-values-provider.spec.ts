import { TestBed } from '@angular/core/testing';

import { DSL_NOT_READY, DslRecordable, DslRecorderService } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { DslCacheServiceMock } from '../../../core/test/dsl/dsl-cache.mock';
import { UserServiceMock } from '../../../core/test/user/user.mock';
import { SelfExclusionDslValuesProvider } from '../src/self-exclusion-dsl-values-provider';
import { SelfExclusionServiceMock } from './self-exclusion.mock';

describe('SelfExclusionDslValuesProvider', () => {
    let target: DslRecordable;
    let selfExclusionServiceMock: SelfExclusionServiceMock;
    let dslCacheServiceMock: DslCacheServiceMock;
    let userServiceMock: UserServiceMock;

    beforeEach(() => {
        selfExclusionServiceMock = MockContext.useMock(SelfExclusionServiceMock);
        dslCacheServiceMock = MockContext.useMock(DslCacheServiceMock);
        userServiceMock = MockContext.useMock(UserServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, DslRecorderService, SelfExclusionDslValuesProvider],
        });

        const provider = TestBed.inject(SelfExclusionDslValuesProvider);
        TestBed.inject(DslRecorderService).beginRecording();
        target = provider.getProviders()['SelfExclusion']!;
    });

    describe('SelfExclusion', () => {
        it('should return default values is the user is not authenticated', () => {
            userServiceMock.isAuthenticated = false;

            expect(target['Category']).toBe('');
            expect(target['StartDate']).toBe('');
            expect(target['EndDate']).toBe('');
        });

        it('should return not ready initially', () => {
            userServiceMock.isAuthenticated = true;

            expect(() => target['Category']).toThrowError(DSL_NOT_READY);
        });

        it('should get value once loaded', () => {
            userServiceMock.isAuthenticated = true;
            selfExclusionServiceMock.details.next({ categoryId: 'self', startDate: '2021-11-12', endDate: '2021-12-21' });

            expect(target['Category']).toBe('self');
            expect(target['StartDate']).toBe('2021-11-12');
            expect(target['EndDate']).toBe('2021-12-21');
        });
    });

    describe('watcher', () => {
        it('should invalidate cache and update value on selfExclusion event', () => {
            selfExclusionServiceMock.details.next({ categoryId: 'self', startDate: '', endDate: '' });

            expect(dslCacheServiceMock.invalidate).toHaveBeenCalledWith(['selfExclusion']);
        });
    });
});
