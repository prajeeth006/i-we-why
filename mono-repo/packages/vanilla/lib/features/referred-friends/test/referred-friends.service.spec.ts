import { ComponentPortal } from '@angular/cdk/portal';
import { TestBed } from '@angular/core/testing';

import { AnimateOverlayFrom } from '@frontend/vanilla/shared/overlay-factory';
import { MockContext } from 'moxxi';
import { of } from 'rxjs';

import { SharedFeaturesApiServiceMock } from '../../../core/src/http/test/shared-features-api.mock';
import { DeviceServiceMock } from '../../../core/test/browser/device.mock';
import { OverlayRefMock } from '../../../shared/overlay-factory/test/cdk-overlay.mock';
import { OverlayFactoryMock } from '../../../shared/overlay-factory/test/overlay-factory.mock';
import { InvitationUrl } from '../src/referred-friends.models';
import { ReferredFriendsService } from '../src/referred-friends.service';

describe('ReferredFriendsService', () => {
    let service: ReferredFriendsService;
    let overlayFactoryMock: OverlayFactoryMock;
    let deviceServiceMock: DeviceServiceMock;
    let overlayRefMock: OverlayRefMock;
    let sharedFeaturesApiServiceMock: SharedFeaturesApiServiceMock;

    beforeEach(() => {
        overlayFactoryMock = MockContext.useMock(OverlayFactoryMock);
        deviceServiceMock = MockContext.useMock(DeviceServiceMock);
        sharedFeaturesApiServiceMock = MockContext.useMock(SharedFeaturesApiServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, ReferredFriendsService],
        });

        service = TestBed.inject(ReferredFriendsService);

        overlayRefMock = new OverlayRefMock();
        overlayFactoryMock.create.and.returnValue(overlayRefMock);
    });

    describe('toggleReferFriend', () => {
        it('should create overlay and attach refer friend component', () => {
            service.toggleReferFriend(true);

            expect(overlayFactoryMock.create).toHaveBeenCalledOnceWith({
                panelClass: 'vn-refer-friend',
            });
            expect(overlayRefMock.attach).toHaveBeenCalledOnceWith(jasmine.any(ComponentPortal));
            expect(overlayFactoryMock.createAnimatedOverlayStates).not.toHaveBeenCalled();
            expect(overlayRefMock.updatePositionStrategy).not.toHaveBeenCalled();
        });

        it('should update position strategy of the create overlay for mobile', () => {
            deviceServiceMock.isMobile = true;

            service.toggleReferFriend(true);

            expect(overlayFactoryMock.createAnimatedOverlayStates).toHaveBeenCalledOnceWith(AnimateOverlayFrom.Bottom);
            expect(overlayRefMock.updatePositionStrategy).toHaveBeenCalledOnceWith(overlayFactoryMock.position.global());
        });
    });

    describe('toggleReferralCompleted', () => {
        it('should create overlay and attach refer complete component', () => {
            overlayRefMock.attach.and.returnValue({
                setInput: () => {},
            });
            overlayFactoryMock.create.and.returnValue(overlayRefMock);
            service.toggleReferralCompleted(true);

            expect(overlayFactoryMock.create).toHaveBeenCalledOnceWith({
                panelClass: ['vn-refer-friend-completed', 'vn-dialog-container'],
            });
            expect(overlayRefMock.attach).toHaveBeenCalledOnceWith(jasmine.any(ComponentPortal));
        });
    });

    describe('refresh', () => {
        it('should call api if not loaded', () => {
            const response: InvitationUrl = { url: 'https://example.com' };
            sharedFeaturesApiServiceMock.get.withArgs('referredFriends/invitationUrl').and.returnValue(of(response));

            service.refresh();

            expect(sharedFeaturesApiServiceMock.get).toHaveBeenCalledOnceWith('referredFriends/invitationUrl');
            service.invitationUrl.subscribe((url: string) => expect(url).toBe(response.url));
        });
    });
});
