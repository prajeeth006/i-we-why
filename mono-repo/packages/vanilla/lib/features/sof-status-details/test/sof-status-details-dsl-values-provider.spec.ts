import { TestBed } from '@angular/core/testing';

import { DSL_NOT_READY, DslRecordable, DslRecorderService, SofStatusDetails } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { DslCacheServiceMock } from '../../../core/test/dsl/dsl-cache.mock';
import { UserServiceMock } from '../../../core/test/user/user.mock';
import { SofStatusDetailsDslValuesProvider } from '../src/sof-status-details-dsl-values-provider';
import { SofStatusDetailsServiceMock } from './sof-status.mock';

describe('SofStatusDetailsDslValuesProvider', () => {
    let target: DslRecordable;
    let sofStatusDetailsServiceMock: SofStatusDetailsServiceMock;
    let dslCacheServiceMock: DslCacheServiceMock;
    let userServiceMock: UserServiceMock;

    beforeEach(() => {
        sofStatusDetailsServiceMock = MockContext.useMock(SofStatusDetailsServiceMock);
        dslCacheServiceMock = MockContext.useMock(DslCacheServiceMock);
        userServiceMock = MockContext.useMock(UserServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, DslRecorderService, SofStatusDetailsDslValuesProvider],
        });

        const provider = TestBed.inject(SofStatusDetailsDslValuesProvider);
        TestBed.inject(DslRecorderService).beginRecording();
        target = provider.getProviders()['SofStatusDetails']!;
    });

    describe('SofStatusDetails', () => {
        it('should return default values is the user is not authenticated', () => {
            userServiceMock.isAuthenticated = false;

            expect(target['SofStatus']).toBe('');
            expect(target['RedStatusDays']).toBe(-1);
        });

        it('should return not ready initially', () => {
            userServiceMock.isAuthenticated = true;

            expect(() => target['SofStatus']).toThrowError(DSL_NOT_READY);
            expect(() => target['RedStatusDays']).toThrowError(DSL_NOT_READY);
        });

        it('should get value once loaded', () => {
            userServiceMock.isAuthenticated = true;
            sofStatusDetailsServiceMock.statusDetails.next(SofStatusDetails);

            expect(target['SofStatus']).toBe('red');
            expect(target['RedStatusDays']).toBe(3);
        });
    });

    describe('watcher', () => {
        it('should invalidate cache and update value if there is sof status details event', () => {
            sofStatusDetailsServiceMock.statusDetails.next(SofStatusDetails);

            expect(dslCacheServiceMock.invalidate).toHaveBeenCalledWith(['sofStatusDetails']);
        });
    });

    const SofStatusDetails: SofStatusDetails = {
        sofStatus: 'red',
        redStatusDays: 3,
    };
});
