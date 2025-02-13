import { OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Injectable, Injector, inject } from '@angular/core';

import { DeviceService, SharedFeaturesApiService } from '@frontend/vanilla/core';
import { AnimatedOverlayRef } from '@frontend/vanilla/features/overlay';
import { AnimateOverlayFrom, AnimatedOverlayStates, OverlayFactory } from '@frontend/vanilla/shared/overlay-factory';
import { BehaviorSubject, Observable } from 'rxjs';

import { BonusNotificationOverlayComponent } from './bonus-notification/bonus-notification-overlay.component';
import { ReferFriendOverlayComponent } from './refer-friend/refer-friend-overlay.component';
import { BonusNotificationMessage, InvitationUrl } from './referred-friends.models';

/**
 * @whatItDoes Provides refer friend functionality.
 *
 * @stable
 */
@Injectable({
    providedIn: 'root',
})
export class ReferredFriendsService {
    private overlayFactory = inject(OverlayFactory);
    private injector = inject(Injector);
    private deviceService = inject(DeviceService);
    private sharedFeaturesApiService = inject(SharedFeaturesApiService);

    private overlayRef: OverlayRef | null;
    private animatedOverlayRef: AnimatedOverlayRef | null;
    private referFriendVisibleEvents: BehaviorSubject<boolean> = new BehaviorSubject(false);
    private invitationUrlEvents: BehaviorSubject<string> = new BehaviorSubject('');
    private loaded: boolean;

    /**
     * Observable of when refer friend overlay is shown or hidden.
     * Will instantly return current value to subscribers.
     * @returns Observable<boolean>
     */
    get isReferFriendVisible(): Observable<boolean> {
        return this.referFriendVisibleEvents;
    }

    /**
     * @returns An observable that emits the invitation URL.
     */
    get invitationUrl(): Observable<string> {
        return this.invitationUrlEvents;
    }

    /**
     * Toggles the refer friend overlay.
     * @param show - A boolean indicating whether to show or hide the overlay.
     */
    toggleReferFriend(show: boolean) {
        if (show && !this.animatedOverlayRef) {
            const overlayRef = this.overlayFactory.create({
                panelClass: 'vn-refer-friend',
            });

            let animatedStates: AnimatedOverlayStates | null = null;

            if (this.deviceService.isMobile) {
                animatedStates = this.overlayFactory.createAnimatedOverlayStates(AnimateOverlayFrom.Bottom);
                overlayRef.updatePositionStrategy(this.overlayFactory.position.global());
            }

            this.animatedOverlayRef = new AnimatedOverlayRef(overlayRef, animatedStates);

            overlayRef.backdropClick().subscribe(() => this.animatedOverlayRef?.close());

            this.animatedOverlayRef.afterClosed().subscribe(() => {
                this.overlayFactory.dispose(overlayRef);
                this.animatedOverlayRef = null;
            });

            const portal = new ComponentPortal(
                ReferFriendOverlayComponent,
                null,
                Injector.create({
                    providers: [{ provide: AnimatedOverlayRef, useValue: this.animatedOverlayRef }],
                    parent: this.injector,
                }),
            );

            overlayRef.attach(portal);
        } else {
            this.animatedOverlayRef?.close();
        }
    }

    /**
     * Toggles the referral completed overlay.
     * @param show - A boolean indicating whether to show or hide the overlay.
     * @param message - An optional message to display in the overlay.
     */
    toggleReferralCompleted(show: boolean, message?: BonusNotificationMessage) {
        if (show && !this.overlayRef) {
            this.overlayRef = this.overlayFactory.create({
                panelClass: ['vn-refer-friend-completed', 'vn-dialog-container'],
            });

            this.overlayRef.detachments().subscribe(() => {
                this.overlayFactory.dispose(this.overlayRef);
                this.overlayRef = null;
            });

            const portal = new ComponentPortal(
                BonusNotificationOverlayComponent,
                null,
                Injector.create({
                    providers: [{ provide: OverlayRef, useValue: this.overlayRef }],
                    parent: this.injector,
                }),
            );

            const componentRef = this.overlayRef.attach(portal);
            componentRef.setInput('message', message);
        } else {
            this.overlayRef?.detach();
        }
    }

    /**
     * Refreshes the invitation URL.
     */
    refresh() {
        this.loaded = false;
        this.load();
    }

    private load() {
        if (!this.loaded) {
            this.loaded = true;

            this.sharedFeaturesApiService
                .get('referredFriends/invitationUrl')
                .subscribe((response: InvitationUrl) => this.invitationUrlEvents.next(response.url));
        }
    }
}
