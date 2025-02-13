import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { MenuAction, RtmsType } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { MenuActionsServiceMock } from '../../../core/test/menu-actions/menu-actions.mock';
import { RtmsServiceMock } from '../../../shared/rtms/test/stubs/rtms-mocks';
import { ReferredFriendsBootstrapService } from '../src/referred-friends-bootstrap.service';
import { ReferredFriendsConfigMock, ReferredFriendsServiceMock } from './referred-friends.mocks';

describe('ReferredFriendsBootstrapService', () => {
    let service: ReferredFriendsBootstrapService;
    let referredFriendsConfigMock: ReferredFriendsConfigMock;
    let referredFriendsServiceMock: ReferredFriendsServiceMock;
    let menuActionsServiceMock: MenuActionsServiceMock;
    let rtmsServiceMock: RtmsServiceMock;

    beforeEach(() => {
        referredFriendsConfigMock = MockContext.useMock(ReferredFriendsConfigMock);
        referredFriendsServiceMock = MockContext.useMock(ReferredFriendsServiceMock);
        menuActionsServiceMock = MockContext.useMock(MenuActionsServiceMock);
        rtmsServiceMock = MockContext.useMock(RtmsServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, ReferredFriendsBootstrapService],
        });

        service = TestBed.inject(ReferredFriendsBootstrapService);
    });

    describe('onFeatureInit', () => {
        it('should register the menu action and toggle the refer friend overlay', fakeAsync(() => {
            service.onFeatureInit();
            referredFriendsConfigMock.whenReady.next();
            referredFriendsServiceMock.isReferFriendVisible.next(true);
            tick();

            expect(menuActionsServiceMock.register).toHaveBeenCalledOnceWith(MenuAction.TOGGLE_REFERRED_FRIENDS, jasmine.any(Function));

            menuActionsServiceMock.register.calls.mostRecent().args[1]();

            expect(referredFriendsServiceMock.toggleReferFriend).toHaveBeenCalledOnceWith(true);
        }));

        it(`should toggleReferralCompleted on ${RtmsType.REFERRAL_COMPLETED_EVENT} event`, fakeAsync(() => {
            service.onFeatureInit();
            referredFriendsConfigMock.whenReady.next();
            tick();

            const event = { type: RtmsType.REFERRAL_COMPLETED_EVENT, eventId: '123', payload: { bonusAmount: 100, username: 'test' } };
            rtmsServiceMock.messages.next(event);

            expect(referredFriendsServiceMock.toggleReferralCompleted).toHaveBeenCalledOnceWith(true, event.payload);
        }));
    });
});
