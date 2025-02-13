import { CommonModule } from '@angular/common';
import { Component, OnChanges, OnInit } from '@angular/core';

import { IconCustomComponent } from '@frontend/vanilla/features/icons';
import { ImageComponent } from '@frontend/vanilla/shared/image';
import { SwiperComponent } from '@frontend/vanilla/shared/swiper';

import { RtmsOverlayComponentBase } from '../rtms-overlay-component-base';

@Component({
    standalone: true,
    imports: [CommonModule, SwiperComponent, ImageComponent, IconCustomComponent],
    selector: 'vn-rtms-mobile-games-locked-list',
    templateUrl: 'rtms-mobile-games-locked-list.component.html',
})
export class RtmsMobileGamesLockedListComponent extends RtmsOverlayComponentBase implements OnInit, OnChanges {
    slidesPerView: number = 3;
    constructor() {
        super();
    }
}
