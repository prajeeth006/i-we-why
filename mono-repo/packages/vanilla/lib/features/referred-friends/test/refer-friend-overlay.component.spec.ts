import { AnimationEvent } from '@angular/animations';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { ToastrType, WorkerType } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { DeviceServiceMock } from '../../../core/test/browser/device.mock';
import { ToastrQueueServiceMock } from '../../../core/test/toastr/toastr-queue.mock';
import { WebWorkerServiceMock } from '../../../core/test/web-worker/web-worker.service.mock';
import { ClipboardServiceMock } from '../../../shared/clipboard/test/clipboard.service.mocks';
import { ShareServiceMock } from '../../../shared/share/test/share.service.mocks';
import { AnimatedOverlayRefMock } from '../../product-menu/test/animated-overlay-ref.mock';
import { ReferFriendOverlayComponent } from '../src/refer-friend/refer-friend-overlay.component';
import { ReferredFriendsConfigMock, ReferredFriendsServiceMock } from './referred-friends.mocks';

describe('ReferFriendOverlayComponent', () => {
    let fixture: ComponentFixture<ReferFriendOverlayComponent>;
    let component: ReferFriendOverlayComponent;
    let animatedOverlayRefMock: AnimatedOverlayRefMock;
    let referredFriendsConfigMock: ReferredFriendsConfigMock;
    let referredFriendsServiceMock: ReferredFriendsServiceMock;
    let shareServiceMock: ShareServiceMock;
    let toastrQueueServiceMock: ToastrQueueServiceMock;
    let webWorkerServiceMock: WebWorkerServiceMock;
    let deviceServiceMock: DeviceServiceMock;
    let clipboardServiceMock: ClipboardServiceMock;

    beforeEach(() => {
        animatedOverlayRefMock = MockContext.useMock(AnimatedOverlayRefMock);
        referredFriendsConfigMock = MockContext.useMock(ReferredFriendsConfigMock);
        referredFriendsServiceMock = MockContext.useMock(ReferredFriendsServiceMock);
        shareServiceMock = MockContext.useMock(ShareServiceMock);
        toastrQueueServiceMock = MockContext.useMock(ToastrQueueServiceMock);
        webWorkerServiceMock = MockContext.useMock(WebWorkerServiceMock);
        deviceServiceMock = MockContext.useMock(DeviceServiceMock);
        clipboardServiceMock = MockContext.useMock(ClipboardServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers],
            imports: [NoopAnimationsModule],
        });

        fixture = TestBed.createComponent(ReferFriendOverlayComponent);
        component = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
        it('should set the initial overlay state when animation is enabled', () => {
            animatedOverlayRefMock.shouldAnimate = true;
            animatedOverlayRefMock.states = { initial: 'initial', off: 'off', on: 'on' };
            const stateSpy = spyOn(component.state, 'set');

            fixture.detectChanges();

            expect(stateSpy.calls.first().args[0]).toBe('initial');
            expect(stateSpy.calls.mostRecent().args[0]).toBe('on');
            expect(webWorkerServiceMock.createWorker).toHaveBeenCalledOnceWith(
                WorkerType.ReferFriendOverlayTimeout,
                { timeout: 0 },
                jasmine.any(Function),
            );
        });

        it('should set animation state to off before close', () => {
            animatedOverlayRefMock.shouldAnimate = true;
            animatedOverlayRefMock.states = { initial: 'initial', off: 'off', on: 'on' };
            const stateSpy = spyOn(component.state, 'set');

            fixture.detectChanges();
            animatedOverlayRefMock.beforeClose.next();

            expect(stateSpy.calls.mostRecent().args[0]).toBe('off');
        });

        it('should copy URL to clipboard and show toastr', async () => {
            clipboardServiceMock.copy.and.returnValue(true);
            shareServiceMock.share.and.returnValue(Promise.resolve(false));
            await component.shareReferralLink();

            fixture.detectChanges();
            animatedOverlayRefMock.beforeClose.next();

            expect(clipboardServiceMock.copy).toHaveBeenCalledOnceWith(referredFriendsConfigMock.invitationUrl.url);
            expect(toastrQueueServiceMock.add).toHaveBeenCalledOnceWith(ToastrType.CopyToClipboard);
        });
    });

    describe('shareReferralLink', () => {
        it('should create referral link and close the overlay', async () => {
            deviceServiceMock.isMobile = true;
            await component.shareReferralLink();

            expect(shareServiceMock.share).toHaveBeenCalledOnceWith({
                title: referredFriendsConfigMock.shareContent.text,
                text: '',
                url: referredFriendsConfigMock.invitationUrl.url,
            });
            expect(referredFriendsServiceMock.toggleReferFriend).toHaveBeenCalledOnceWith(false);
        });

        it('should not share referral link on desktop', async () => {
            deviceServiceMock.isMobile = false;
            await component.shareReferralLink();

            expect(shareServiceMock.share).not.toHaveBeenCalled();
            expect(referredFriendsServiceMock.toggleReferFriend).toHaveBeenCalledOnceWith(false);
        });
    });

    describe('onAnimationEvent', () => {
        it('should call animated overlay ref onAnimationEvent', () => {
            const event = <AnimationEvent>{ fromState: 'top' };

            component.onAnimationEvent(event);

            expect(animatedOverlayRefMock.onAnimationEvent).toHaveBeenCalledOnceWith(event);
        });
    });

    describe('close', () => {
        it('should close the overlay', () => {
            component.close();

            expect(referredFriendsServiceMock.toggleReferFriend).toHaveBeenCalledOnceWith(false);
        });
    });
});
