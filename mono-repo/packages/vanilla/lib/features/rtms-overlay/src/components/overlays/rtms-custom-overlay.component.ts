import { CommonModule } from '@angular/common';
import { Component, OnChanges, OnInit } from '@angular/core';

import { DeviceService } from '@frontend/vanilla/core';
import { IconCustomComponent } from '@frontend/vanilla/features/icons';
import { TrustAsHtmlPipe } from '@frontend/vanilla/shared/browser';
import { ImageComponent } from '@frontend/vanilla/shared/image';
import { NotificationMessageHeaderType } from '@frontend/vanilla/shared/rtms';

import { RtmsCtaActionComponent } from '../rtms-cta-action.component';
import { RtmsDesktopGamesLockedListComponent } from './gamelist/rtms-desktop-games-locked-list.component';
import { RtmsDesktopGamesUnlockedListComponent } from './gamelist/rtms-desktop-games-unlocked-list.component';
import { RtmsMobileGamesLockedListComponent } from './gamelist/rtms-mobile-games-locked-list.component';
import { RtmsMobileGamesUnlockedListComponent } from './gamelist/rtms-mobile-games-unlocked-list.component';
import { RtmsOverlayComponentBase } from './rtms-overlay-component-base';

@Component({
    standalone: true,
    imports: [
        CommonModule,
        TrustAsHtmlPipe,
        RtmsCtaActionComponent,
        ImageComponent,
        RtmsDesktopGamesLockedListComponent,
        RtmsDesktopGamesUnlockedListComponent,
        RtmsMobileGamesLockedListComponent,
        RtmsMobileGamesUnlockedListComponent,
        IconCustomComponent,
    ],
    selector: 'vn-rtms-custom-overlay',
    templateUrl: 'rtms-custom-overlay.component.html',
})
export class RtmsCustomOverlayComponent extends RtmsOverlayComponentBase implements OnInit, OnChanges {
    isMobile: boolean;
    HeaderType = NotificationMessageHeaderType;

    constructor(public deviceService: DeviceService) {
        super();
    }

    override ngOnInit() {
        this.isMobile = this.deviceService.isMobile;
    }
}
