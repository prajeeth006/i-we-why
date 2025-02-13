import { CommonModule } from '@angular/common';
import { Component, OnChanges, OnInit } from '@angular/core';

import { TimerService } from '@frontend/vanilla/core';
import { ImageComponent } from '@frontend/vanilla/shared/image';
import { SwiperComponent } from '@frontend/vanilla/shared/swiper';

import { RtmsLayerComponentBase } from './rtms-layer-component-base';

@Component({
    standalone: true,
    imports: [CommonModule, SwiperComponent, ImageComponent],
    selector: 'lh-rtms-layer-mobile-games-unlocked-list',
    templateUrl: 'rtms-layer-mobile-games-unlocked-list.component.html',
})
export class RtmsLayerMobileGamesUnlockedListComponent extends RtmsLayerComponentBase implements OnInit, OnChanges {
    slidesPerView: number = 3;

    constructor(timerService: TimerService) {
        super(timerService);
    }
}
