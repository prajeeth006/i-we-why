import { Injectable, NgZone } from '@angular/core';

import { OnFeatureInit, UserEvent, UserLoginEvent, UserService } from '@frontend/vanilla/core';
import { firstValueFrom } from 'rxjs';
import { filter } from 'rxjs/operators';

import { InactivityScreenOverlayService } from './inactivity-screen-overlay.service';
import { InactivityScreenConfig } from './inactivity-screen.client-config';
import { InactivityScreenService } from './inactivity-screen.service';

@Injectable()
export class InactivityScreenBootstrapService implements OnFeatureInit {
    constructor(
        private inactivityScreenConfig: InactivityScreenConfig,
        private inactivityScreenService: InactivityScreenService,
        private inactivityScreenOverlayService: InactivityScreenOverlayService,
        private userService: UserService,
        private zone: NgZone,
    ) {}

    async onFeatureInit() {
        await firstValueFrom(this.inactivityScreenConfig.whenReady);

        if (this.userService.isAuthenticated) {
            this.init();
        } else {
            this.userService.events.pipe(filter((event: UserEvent) => event instanceof UserLoginEvent)).subscribe(() => this.init());
        }
    }

    private init() {
        this.inactivityScreenService.whenIdle().subscribe(() => {
            this.zone.run(() => this.inactivityScreenOverlayService.showCountdownOverlay());
        });
    }
}
