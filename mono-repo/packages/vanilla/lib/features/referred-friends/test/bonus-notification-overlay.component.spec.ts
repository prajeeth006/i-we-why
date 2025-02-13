import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { BonusNotificationOverlayComponent } from '../src/bonus-notification/bonus-notification-overlay.component';
import { ReferredFriendsConfigMock, ReferredFriendsServiceMock } from './referred-friends.mocks';

describe('BonusNotificationOverlayComponent', () => {
    let fixture: ComponentFixture<BonusNotificationOverlayComponent>;
    let component: BonusNotificationOverlayComponent;
    let referredFriendsServiceMock: ReferredFriendsServiceMock;

    beforeEach(() => {
        referredFriendsServiceMock = MockContext.useMock(ReferredFriendsServiceMock);
        MockContext.useMock(ReferredFriendsConfigMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers],
        });

        fixture = TestBed.createComponent(BonusNotificationOverlayComponent);
        component = fixture.componentInstance;

        fixture.detectChanges();
    });

    describe('close', () => {
        it('close toggle the overlay', () => {
            component.close();

            expect(referredFriendsServiceMock.toggleReferralCompleted).toHaveBeenCalledOnceWith(false);
        });
    });
});
