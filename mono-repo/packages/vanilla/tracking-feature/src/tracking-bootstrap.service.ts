import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, inject } from '@angular/core';

import {
    DeviceService,
    LocationChangeEvent,
    NavigationService,
    OnFeatureInit,
    TRACKING_SERVICE_PROVIDER,
    TagManagerService as TagManagerCoreService,
    TrackingService,
    TrackingServiceProvider,
    UserEvent,
    UserLoginEvent,
    UserService,
    WINDOW,
} from '@frontend/vanilla/core';
import { firstValueFrom } from 'rxjs';
import { first } from 'rxjs/operators';

import { PageViewTrackingService } from './page-view-tracking.service';
import { TagManagerService } from './tag-manager.service';
import { TrackingValueGettersService } from './tracking-value-getters.service';
import { TrackingConfig } from './tracking.client-config';
import { UtmService } from './utm-service';

@Injectable()
export class TrackingBootstrapService implements OnFeatureInit {
    readonly #window = inject(WINDOW);
    private readonly _doc = inject(DOCUMENT);

    constructor(
        private navigationService: NavigationService,
        private pageViewTrackingService: PageViewTrackingService,
        private user: UserService,
        private trackingConfig: TrackingConfig,
        private tagManagerService: TagManagerService,
        private valueGetters: TrackingValueGettersService,
        private utmService: UtmService,
        private deviceService: DeviceService,
        private trackingService: TrackingService,
        private tagManagerCoreService: TagManagerCoreService,
        @Inject(TRACKING_SERVICE_PROVIDER) private trackingServiceProvider: TrackingServiceProvider,
    ) {}

    async onFeatureInit() {
        await firstValueFrom(this.trackingConfig.whenReady);
        if (!this.trackingConfig.isEnabled) {
            return;
        }

        this.tagManagerCoreService.set(this.tagManagerService);
        this.trackingService.set(this.trackingServiceProvider);

        await this.trackingService.addInitialValues();

        // Browser data
        this.trackingServiceProvider.updateDataLayer({
            'browser.screenResolution': this.valueGetters.browserScreenResolution(),
        });

        this.deviceService.orientation.subscribe(() => {
            this.trackingServiceProvider.updateDataLayer({
                'browser.orientation': this.valueGetters.browserOrientation(),
            });
        });

        this.trackingServiceProvider.setReferrer(this._doc.referrer);
        this.pageViewTrackingService.trackPageView(this.utmService.parseFromUrl(this.#window.location.href));
        this.navigationService.locationChange.subscribe((e: LocationChangeEvent) => {
            if (e.previousUrl === e.nextUrl) {
                return;
            }

            this.trackingServiceProvider.setReferrer(e.previousUrl);
            this.pageViewTrackingService.trackPageView(this.utmService.parseFromUrl(e.nextUrl), e.id);
        });

        this.user.events.pipe(first((e: UserEvent) => e instanceof UserLoginEvent)).subscribe(() => {
            this.trackingServiceProvider.updateUserContactabilityStatus();
        });
        this.tagManagerService.init();
    }
}
