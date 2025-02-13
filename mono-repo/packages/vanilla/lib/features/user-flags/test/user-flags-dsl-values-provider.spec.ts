import { TestBed } from '@angular/core/testing';

import { DSL_NOT_READY, DslRecordable, DslRecorderService } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { DslCacheServiceMock } from '../../../core/test/dsl/dsl-cache.mock';
import { UserServiceMock } from '../../../core/test/user/user.mock';
import { UserFlagsDslValuesProvider } from '../src/user-flags-dsl-values-provider';
import { UserFlagsServiceMock } from './user-flags.mock';

describe('UserFlagsDslValuesProvider', () => {
    let target: DslRecordable;
    let userFlagsServiceMock: UserFlagsServiceMock;
    let dslCacheServiceMock: DslCacheServiceMock;
    let userServiceMock: UserServiceMock;

    beforeEach(() => {
        userFlagsServiceMock = MockContext.useMock(UserFlagsServiceMock);
        dslCacheServiceMock = MockContext.useMock(DslCacheServiceMock);
        userServiceMock = MockContext.useMock(UserServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, DslRecorderService, UserFlagsDslValuesProvider],
        });

        const provider = TestBed.inject(UserFlagsDslValuesProvider);
        TestBed.inject(DslRecorderService).beginRecording();
        target = provider.getProviders()['UserFlags']!;
    });

    describe('Get', () => {
        it('should return empty string if unauthenticated user', () => {
            userServiceMock.isAuthenticated = false;

            expect(target['Get']('Offer')).toBe('');
            expect(userFlagsServiceMock.load).not.toHaveBeenCalled();
        });

        it('should return not ready initially and trigger a refresh', () => {
            expect(() => target['Get']('Offer')).toThrowError(DSL_NOT_READY);

            expect(userFlagsServiceMock.load).toHaveBeenCalled();
        });

        it('should get value for specified user flags once loaded', () => {
            userFlagsServiceMock.flags.next([
                { name: 'Offers', value: 'test' },
                { name: 'com', value: 'communication' },
            ]);

            expect(target['Get']('Offers')).toBe('test');
            expect(target['Get']('COM')).toBe('communication');
        });

        it('should return empty string if user flag is not defined', () => {
            userFlagsServiceMock.flags.next([
                { name: 'Offers', value: 'test' },
                { name: 'com', value: 'communication' },
            ]);

            expect(target['Get']('test')).toBe('');
        });

        it('should not call load if value was already received', () => {
            userFlagsServiceMock.flags.next([
                { name: 'Offers', value: 'test' },
                { name: 'com', value: 'communication' },
            ]);
            userFlagsServiceMock.load.calls.reset();

            expect(target['Get']('Offers')).toBe('test');

            expect(userFlagsServiceMock.load).not.toHaveBeenCalled();
        });

        it('should call load only once', () => {
            userFlagsServiceMock.load.calls.reset();

            expect(() => target['Get']('Offers')).toThrowError(DSL_NOT_READY);
            expect(() => target['Get']('Offers')).toThrowError(DSL_NOT_READY);

            expect(userFlagsServiceMock.load).toHaveBeenCalledTimes(1);
        });
    });

    describe('HasReasonCode', () => {
        it('should return false if unauthenticated user', () => {
            userServiceMock.isAuthenticated = false;

            expect(target['HasReasonCode']('R100')).toBeFalse();
            expect(userFlagsServiceMock.load).not.toHaveBeenCalled();
        });

        it('should return not ready initially and trigger a refresh', () => {
            expect(() => target['HasReasonCode']('Offer', 'R100')).toThrowError(DSL_NOT_READY);

            expect(userFlagsServiceMock.load).toHaveBeenCalled();
        });

        it('should return true for specified reason code once loaded', () => {
            userFlagsServiceMock.flags.next([
                { name: 'Offers', value: 'test', reasonCodes: ['R100', 'R101'] },
                { name: 'com', value: 'communication' },
            ]);

            expect(target['HasReasonCode']('R102, r101 ')).toBeTrue();
        });

        it('should return false if reason code is not found', () => {
            userFlagsServiceMock.flags.next([
                { name: 'Offers', value: 'test', reasonCodes: ['R100', 'R101'] },
                { name: 'com', value: 'communication' },
            ]);

            expect(target['HasReasonCode']('R102, R103')).toBeFalse();
        });

        it('should not call load if value was already received', () => {
            userFlagsServiceMock.flags.next([
                { name: 'Offers', value: 'test', reasonCodes: ['R100', 'R101'] },
                { name: 'com', value: 'communication' },
            ]);
            userFlagsServiceMock.load.calls.reset();

            expect(target['HasReasonCode']('r100')).toBeTrue();

            expect(userFlagsServiceMock.load).not.toHaveBeenCalled();
        });

        it('should call load only once', () => {
            userFlagsServiceMock.load.calls.reset();

            expect(() => target['HasReasonCode']('R100')).toThrowError(DSL_NOT_READY);
            expect(() => target['HasReasonCode']('R100')).toThrowError(DSL_NOT_READY);

            expect(userFlagsServiceMock.load).toHaveBeenCalledTimes(1);
        });
    });

    describe('watcher', () => {
        it('should invalidate cache and update value if there is user flag event', () => {
            userFlagsServiceMock.flags.next([
                { name: 'Offers', value: 'test' },
                { name: 'com', value: 'communication' },
            ]);

            expect(dslCacheServiceMock.invalidate).toHaveBeenCalledWith(['userFlags.Get', 'userFlags.HasReasonCode']);
        });
    });
});
