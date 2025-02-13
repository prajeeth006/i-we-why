import { CommonModule } from '@angular/common';
import { Component, OnChanges, OnInit } from '@angular/core';

import { ImageComponent } from '@frontend/vanilla/shared/image';
import { SwiperComponent } from '@frontend/vanilla/shared/swiper';

import { RtmsOverlayComponentBase } from '../rtms-overlay-component-base';

@Component({
    standalone: true,
    imports: [CommonModule, SwiperComponent, ImageComponent],
    selector: 'vn-rtms-mobile-games-unlocked-list',
    templateUrl: 'rtms-mobile-games-unlocked-list.component.html',
})
export class RtmsMobileGamesUnlockedListComponent extends RtmsOverlayComponentBase implements OnInit, OnChanges {
    slidesPerView: number = 3;
    constructor() {
        super();
    }
}
