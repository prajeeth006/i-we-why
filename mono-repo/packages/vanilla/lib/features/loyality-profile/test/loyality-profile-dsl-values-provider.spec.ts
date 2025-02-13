import { TestBed } from '@angular/core/testing';

import { DSL_NOT_READY, DslRecordable, DslRecorderService } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { DslCacheServiceMock } from '../../../core/test/dsl/dsl-cache.mock';
import { UserServiceMock } from '../../../core/test/user/user.mock';
import { LoyalityProfileDslValuesProvider } from '../src/loyality-profile-dsl-values-provider';
import { MlifeLoyalityProfile } from '../src/loyality-profile.models';
import { LoyalityProfileServiceMock } from './loyality-profile-service.mock';

describe('LoyalityProfileDslValuesProvider', () => {
    let target: DslRecordable;
    let userServiceMock: UserServiceMock;
    let loyalityProfileServiceMock: LoyalityProfileServiceMock;
    let dslCacheServiceMock: DslCacheServiceMock;
    beforeEach(() => {
        userServiceMock = MockContext.useMock(UserServiceMock);
        dslCacheServiceMock = MockContext.useMock(DslCacheServiceMock);
        loyalityProfileServiceMock = MockContext.useMock(LoyalityProfileServiceMock);
        TestBed.configureTestingModule({
            providers: [MockContext.providers, DslRecorderService, LoyalityProfileDslValuesProvider],
        });

        const provider = TestBed.inject(LoyalityProfileDslValuesProvider);
        TestBed.inject(DslRecorderService).beginRecording();
        target = provider.getProviders()['LoyalityProfile']!;
    });

    describe('LoyalityProfile', () => {
        it('should return default values is the user is not authenticated', () => {
            userServiceMock.isAuthenticated = false;
            loyalityProfileServiceMock.mlifeLoyalityProfile.next(mlifeLoyality);
            expect(target['MlifeNo']).toBe(-1);
            expect(target['Tier']).toBeEmptyString();
            expect(target['TierDesc']).toBeEmptyString;
            expect(target['TierCredits']).toBe(-1);
        });

        it('should return not ready initially', () => {
            userServiceMock.isAuthenticated = true;
            expect(() => target['MlifeNo']).toThrowError(DSL_NOT_READY);
            expect(() => target['Tier']).toThrowError(DSL_NOT_READY);
            expect(() => target['TierDesc']).toThrowError(DSL_NOT_READY);
            expect(() => target['TierCredits']).toThrowError(DSL_NOT_READY);
        });

        it('should get value once loaded', () => {
            userServiceMock.isAuthenticated = true;
            loyalityProfileServiceMock.mlifeLoyalityProfile.next(mlifeLoyality);
            expect(target['MlifeNo']).toBe(-1);
            expect(target['Tier']).toBeEmptyString();
            expect(target['TierDesc']).toBeEmptyString;
            expect(target['TierCredits']).toBe(-1);
        });
    });
    describe('watcher', () => {
        it('should invalidate cache and update value if there is loyalityProfile status event', () => {
            loyalityProfileServiceMock.mlifeLoyalityProfile.next(mlifeLoyality);
            expect(dslCacheServiceMock.invalidate).toHaveBeenCalledWith(['loyalityProfile']);
        });
    });
    const mlifeLoyality: MlifeLoyalityProfile = {
        mlifeNo: -1,
        tier: '',
        tierDesc: '',
        tierCredits: -1,
    };
});
