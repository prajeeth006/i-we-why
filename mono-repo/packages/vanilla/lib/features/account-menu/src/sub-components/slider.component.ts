import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';

import { DeviceService, DynamicComponentDirective, toBoolean } from '@frontend/vanilla/core';
import { SwiperComponent } from '@frontend/vanilla/shared/swiper';
import { EffectCoverflow } from 'swiper/modules';
import { Swiper, SwiperOptions } from 'swiper/types';

import { AccountMenuItemBase } from '../account-menu-item-base';
import { AccountMenuTrackingService } from '../account-menu-tracking.service';

@Component({
    standalone: true,
    imports: [CommonModule, DynamicComponentDirective, SwiperComponent],
    selector: 'vn-am-slider',
    templateUrl: 'slider.html',
})
export class SliderComponent extends AccountMenuItemBase implements OnInit, AfterViewInit {
    @ViewChild(SwiperComponent) swiperComponentRef: SwiperComponent;

    swiperConfig: SwiperOptions = {
        modules: [EffectCoverflow],
        slidesPerView: 'auto',
        centeredSlides: true,
        navigation: !this.device.isTouch,
    };

    constructor(
        public device: DeviceService,
        private accountMenuTrackingService: AccountMenuTrackingService,
    ) {
        super();
    }
    ngAfterViewInit(): void {
        const swiperInstance = this.swiperComponentRef.swiper;
        swiperInstance.on('slideChange', (swiperReference) => {
            this.slideChanged(swiperReference);
        });
    }

    ngOnInit() {
        this.swiperConfig.pagination = toBoolean(this.item.parameters['show-dots']) && this.item.children.length > 1 ? true : false;
    }

    slideChanged(swiperReference: Swiper) {
        if (swiperReference.activeIndex == 1) {
            const el = swiperReference.el;
            const container = el.getElementsByClassName('am-text');
            if (container[0]?.innerHTML.toLowerCase().indexOf('statistic') != -1) {
                this.accountMenuTrackingService.trackSessionStatisticsNavigate();
            }
        }
    }
}
