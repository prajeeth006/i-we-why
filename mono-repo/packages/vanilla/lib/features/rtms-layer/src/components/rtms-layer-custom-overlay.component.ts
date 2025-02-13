import { CommonModule } from '@angular/common';
import { Component, OnChanges, OnInit } from '@angular/core';

import { DeviceService, TimerService } from '@frontend/vanilla/core';
import { LhHeaderBarComponent } from '@frontend/vanilla/features/header-bar';
import { IconCustomComponent } from '@frontend/vanilla/features/icons';
import { TrustAsHtmlPipe } from '@frontend/vanilla/shared/browser';
import { ImageComponent } from '@frontend/vanilla/shared/image';

import { RtmsCtaActionComponent } from './rtms-cta-action.component';
import { RtmsLayerComponentBase } from './rtms-layer-component-base';
import { RtmsLayerDesktopGamesLockedListComponent } from './rtms-layer-desktop-games-locked-list.component';
import { RtmsLayerDesktopGamesUnlockedListComponent } from './rtms-layer-desktop-games-unlocked-list.component';
import { RtmsLayerMobileGamesLockedListComponent } from './rtms-layer-mobile-games-locked-list.component';
import { RtmsLayerMobileGamesUnlockedListComponent } from './rtms-layer-mobile-games-unlocked-list.component';

@Component({
    standalone: true,
    imports: [
        CommonModule,
        TrustAsHtmlPipe,
        ImageComponent,
        RtmsCtaActionComponent,
        LhHeaderBarComponent,
        RtmsLayerMobileGamesLockedListComponent,
        RtmsLayerDesktopGamesLockedListComponent,
        RtmsLayerMobileGamesUnlockedListComponent,
        RtmsLayerDesktopGamesUnlockedListComponent,
        IconCustomComponent,
    ],
    selector: 'lh-rtms-layer-custom-overlay',
    templateUrl: 'rtms-layer-custom-overlay.component.html',
})
export class RtmsLayerCustomOverlayComponent extends RtmsLayerComponentBase implements OnInit, OnChanges {
    isMobile: boolean;

    constructor(
        public deviceService: DeviceService,
        timerService: TimerService,
    ) {
        super(timerService);
    }

    override ngOnInit() {
        this.isMobile = this.deviceService.isMobile;
    }
}
