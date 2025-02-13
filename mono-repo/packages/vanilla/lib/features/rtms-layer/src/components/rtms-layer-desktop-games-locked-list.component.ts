import { CommonModule } from '@angular/common';
import { Component, OnChanges, OnInit } from '@angular/core';

import { TimerService } from '@frontend/vanilla/core';
import { IconCustomComponent } from '@frontend/vanilla/features/icons';
import { ImageComponent } from '@frontend/vanilla/shared/image';
import { SwiperComponent } from '@frontend/vanilla/shared/swiper';

import { RtmsLayerComponentBase } from './rtms-layer-component-base';

@Component({
    standalone: true,
    imports: [CommonModule, SwiperComponent, ImageComponent, IconCustomComponent],
    selector: 'lh-rtms-layer-desktop-games-locked-list',
    templateUrl: 'rtms-layer-desktop-games-locked-list.component.html',
})
export class RtmsLayerDesktopGamesLockedListComponent extends RtmsLayerComponentBase implements OnInit, OnChanges {
    slidesPerView: number = 3;
    arrows: boolean = true;

    constructor(timerService: TimerService) {
        super(timerService);
    }
}
