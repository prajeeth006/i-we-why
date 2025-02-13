import { TestBed } from '@angular/core/testing';

import { DSL_NOT_READY, DslRecordable, DslRecorderService } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { DslCacheServiceMock } from '../../../core/test/dsl/dsl-cache.mock';
import { UserServiceMock } from '../../../core/test/user/user.mock';
import { PlayerAttributesDslValuesProvider } from '../src/player-attributes-dsl-values-provider';
import { PlayerAttributesServiceMock } from './player-attributes.mocks';

describe('PlayerAttributesDslValuesProvider', () => {
    let target: DslRecordable;
    let dslCacheServiceMock: DslCacheServiceMock;
    let userServiceMock: UserServiceMock;
    let playerAttributesServiceMock: PlayerAttributesServiceMock;

    beforeEach(() => {
        dslCacheServiceMock = MockContext.useMock(DslCacheServiceMock);
        userServiceMock = MockContext.useMock(UserServiceMock);
        playerAttributesServiceMock = MockContext.useMock(PlayerAttributesServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, DslRecorderService, PlayerAttributesDslValuesProvider],
        });

        const provider = TestBed.inject(PlayerAttributesDslValuesProvider);
        TestBed.inject(DslRecorderService).beginRecording();
        target = provider.getProviders()['PlayerAttributes']!;
    });

    describe('watchers', () => {
        it('should invalidate cache and update value on invitationUrl event', () => {
            playerAttributesServiceMock.playerAttributes.next({ vip: {}, acknowledgement: {} });
            expect(dslCacheServiceMock.invalidate).toHaveBeenCalledOnceWith(['playerAttributes']);
        });
    });

    describe('GetAcknowledged', () => {
        it('should return not ready initially', () => {
            userServiceMock.isAuthenticated = true;

            expect(() => target['GetAcknowledged']('gracePeriod')).toThrowError(DSL_NOT_READY);
        });

        it('should return default values is the user is not authenticated', () => {
            userServiceMock.isAuthenticated = false;
            playerAttributesServiceMock.playerAttributes.next({ vip: {}, acknowledgement: {} });

            expect(target['GetAcknowledged']('gracePeriod')).toBe('');
        });

        it('should get value once loaded', () => {
            userServiceMock.isAuthenticated = true;
            playerAttributesServiceMock.playerAttributes.next({
                vip: {},
                acknowledgement: { gracePeriod: { value: 'True', updatedAt: 0 } },
            });

            expect(target['GetAcknowledged']('gracePeriod')).toBe('True');
        });
    });

    describe('GetVip', () => {
        it('should return not ready initially', () => {
            userServiceMock.isAuthenticated = true;

            expect(() => target['GetVip']('VIPHUB_GRACE_PERIOD_YN')).toThrowError(DSL_NOT_READY);
        });

        it('should return default values is the user is not authenticated', () => {
            userServiceMock.isAuthenticated = false;
            playerAttributesServiceMock.playerAttributes.next({ vip: {}, acknowledgement: {} });

            expect(target['GetVip']('VIPHUB_GRACE_PERIOD_YN')).toBe('');
        });

        it('should get value once loaded', () => {
            userServiceMock.isAuthenticated = true;
            playerAttributesServiceMock.playerAttributes.next({
                vip: { VIPHUB_GRACE_PERIOD_YN: { value: 'True', updatedAt: 0 } },
                acknowledgement: {},
            });

            expect(target['GetVip']('VIPHUB_GRACE_PERIOD_YN')).toBe('True');
        });
    });
});
