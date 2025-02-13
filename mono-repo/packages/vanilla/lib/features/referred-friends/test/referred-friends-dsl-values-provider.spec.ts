import { TestBed } from '@angular/core/testing';

import { DSL_NOT_READY, DslRecordable, DslRecorderService } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { DslCacheServiceMock } from '../../../core/test/dsl/dsl-cache.mock';
import { UserServiceMock } from '../../../core/test/user/user.mock';
import { ReferredFriendsDslValuesProvider } from '../src/referred-friends-dsl-values-provider';
import { ReferredFriendsServiceMock } from './referred-friends.mocks';

describe('ReferredFriendsDslValuesProvider', () => {
    let target: DslRecordable;
    let dslCacheServiceMock: DslCacheServiceMock;
    let userServiceMock: UserServiceMock;
    let referredFriendsServiceMock: ReferredFriendsServiceMock;

    beforeEach(() => {
        dslCacheServiceMock = MockContext.useMock(DslCacheServiceMock);
        userServiceMock = MockContext.useMock(UserServiceMock);
        referredFriendsServiceMock = MockContext.useMock(ReferredFriendsServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, DslRecorderService, ReferredFriendsDslValuesProvider],
        });

        const provider = TestBed.inject(ReferredFriendsDslValuesProvider);
        TestBed.inject(DslRecorderService).beginRecording();
        target = provider.getProviders()['ReferredFriends']!;
    });

    describe('watchers', () => {
        it('should invalidate cache and update value on invitationUrl event', () => {
            referredFriendsServiceMock.invitationUrl.next('');
            expect(dslCacheServiceMock.invalidate).toHaveBeenCalledWith(['referredFriends']);
        });
    });

    describe('ReferredFriends', () => {
        it('should return not ready initially', () => {
            userServiceMock.isAuthenticated = true;

            expect(() => target['InvitationUrl']).toThrowError(DSL_NOT_READY);
        });

        it('should return default values is the user is not authenticated', () => {
            userServiceMock.isAuthenticated = false;
            referredFriendsServiceMock.invitationUrl.next('https://example.com');

            expect(target['InvitationUrl']).toBe('');
        });

        it('should get value once loaded', () => {
            userServiceMock.isAuthenticated = true;
            referredFriendsServiceMock.invitationUrl.next('https://example.com');

            expect(target['InvitationUrl']).toBe('https://example.com');
        });
    });
});
