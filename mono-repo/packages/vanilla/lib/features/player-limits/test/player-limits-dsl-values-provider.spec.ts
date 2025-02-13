import { TestBed } from '@angular/core/testing';

import { DSL_NOT_READY, DslRecordable, DslRecorderService } from '@frontend/vanilla/core';
import { PlayerLimit } from '@frontend/vanilla/shared/limits';
import { MockContext } from 'moxxi';

import { DslCacheServiceMock } from '../../../core/test/dsl/dsl-cache.mock';
import { UserServiceMock } from '../../../core/test/user/user.mock';
import { PlayerLimitsServiceMock } from '../../../shared/limits/test/player-limits.service.mock';
import { PlayerLimitsDslValuesProvider } from '../src/player-limits-dsl-values-provider';

describe('PlayerLimitsDslValuesProvider', () => {
    let target: DslRecordable;
    let playerLimitsServiceMock: PlayerLimitsServiceMock;
    let dslCacheServiceMock: DslCacheServiceMock;
    let userServiceMock: UserServiceMock;

    beforeEach(() => {
        playerLimitsServiceMock = MockContext.useMock(PlayerLimitsServiceMock);
        dslCacheServiceMock = MockContext.useMock(DslCacheServiceMock);
        userServiceMock = MockContext.useMock(UserServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, DslRecorderService, PlayerLimitsDslValuesProvider],
        });

        const provider = TestBed.inject<PlayerLimitsDslValuesProvider>(PlayerLimitsDslValuesProvider);
        TestBed.inject(DslRecorderService).beginRecording();

        target = provider.getProviders()['PlayerLimits']!;
    });

    describe('PlayerLimits', () => {
        it('should return default values is the user is not authenticated', () => {
            userServiceMock.isAuthenticated = false;
            playerLimitsServiceMock.getLimits.next(PlayerLimits);

            const value = target['GetPlayerLimitsSum']('ONE');

            expect(value).toEqual(-1);
        });

        it('should return not ready initially', () => {
            userServiceMock.isAuthenticated = true;
            playerLimitsServiceMock.getLimits.next(null);

            expect(() => target['GetPlayerLimitsSum']('TWO')).toThrowError(DSL_NOT_READY);
        });

        it('should get value once loaded', () => {
            userServiceMock.isAuthenticated = true;
            playerLimitsServiceMock.getLimits.next(PlayerLimits);

            const value = target['GetPlayerLimitsSum']('ONE,TWO');

            expect(value).toEqual(300);
        });
    });

    describe('subscription', () => {
        it('should invalidate cache and update value if there is kyc status event', () => {
            playerLimitsServiceMock.getLimits.next(PlayerLimits);

            expect(dslCacheServiceMock.invalidate).toHaveBeenCalledWith(['playerLimits']);
        });
    });

    const PlayerLimits: PlayerLimit[] = [
        {
            limitType: 'ONE',
            currentLimit: 100,
        },
        {
            limitType: 'TWO',
            currentLimit: 200,
        },
    ];
});
