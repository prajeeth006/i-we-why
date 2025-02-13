import { Injectable } from '@angular/core';

import { CookieName, CookieService, SharedFeaturesApiService, UserEvent, UserLoginEvent, UserService } from '@frontend/vanilla/core';
import { BehaviorSubject, Observable, retry, throwError, timer } from 'rxjs';
import { filter, mergeMap } from 'rxjs/operators';

/**
 * @whatItDoes Handles third party tracking
 *
 * @howToUse
 *
 * The third-party tracker functionality can be enabled by calling ThirdPartyTrackingService.enableTracker() with correct channelId and productId.
 *
 * ```
 * thirdPartyTrackingService.enableTracker(myChannelId, myProductId);
 * ```
 *
 * @stable
 */
@Injectable({
    providedIn: 'root',
})
export class ThirdPartyTrackingService {
    private trackingContentEvents = new BehaviorSubject<string | null>(null);
    private running: boolean;

    constructor(
        private cookieService: CookieService,
        private apiService: SharedFeaturesApiService,
        private user: UserService,
    ) {
        this.loadTrackingContent();
    }

    get trackingContent(): Observable<string | null> {
        return this.trackingContentEvents;
    }

    enableTracker(channelId: number, productId: number) {
        if (this.cookieService.get(CookieName.TrackingAffiliate)) {
            const targetDate = new Date();
            targetDate.setDate(targetDate.getDate() + 7);

            this.cookieService.putObject(CookieName.ThirdPartyTracker, { channelId: channelId, productId: productId }, { expires: targetDate });

            this.loadTrackingContent();
        }
    }

    private loadTrackingContent() {
        const thirdPartyTracker: any = this.cookieService.getObject(CookieName.ThirdPartyTracker);

        if (!thirdPartyTracker || this.running) {
            return;
        }

        this.running = true;

        if (this.user.isAuthenticated) {
            this.requestTrackingContent();
        } else {
            const sub = this.user.events.pipe(filter((e: UserEvent) => e instanceof UserLoginEvent)).subscribe(() => {
                sub.unsubscribe();

                this.requestTrackingContent();
            });
        }
    }

    // TODO: Implement retry logic using Web worker
    private requestTrackingContent() {
        const thirdPartyTracker = this.cookieService.getObject(CookieName.ThirdPartyTracker);

        this.apiService
            .get('thirdpartytrackingcontent', {
                productId: thirdPartyTracker.productId,
                channelId: thirdPartyTracker.channelId,
            })
            .pipe(
                retry({
                    delay: (errors: Observable<any>) =>
                        errors.pipe(
                            mergeMap((err: any) => {
                                if (!thirdPartyTracker.failureCount) {
                                    thirdPartyTracker.failureCount = 1;
                                } else {
                                    thirdPartyTracker.failureCount++;
                                }

                                if (thirdPartyTracker.failureCount > 4) {
                                    this.cleanup();

                                    return throwError(err);
                                }

                                this.cookieService.putObject(CookieName.ThirdPartyTracker, thirdPartyTracker);

                                return timer(10000);
                            }),
                        ),
                }),
            )
            .subscribe({
                next: (result) => {
                    this.trackingContentEvents.next(result.content);
                    this.cleanup();
                },
                error: () => {},
            });
    }

    private cleanup() {
        this.running = false;
        this.cookieService.remove(CookieName.ThirdPartyTracker);
    }
}
