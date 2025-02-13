import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, NgZone, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';

import { DeviceService, DynamicComponentDirective, MenuContentItem, Page, TimerService, toBoolean } from '@frontend/vanilla/core';
import { IconCustomComponent } from '@frontend/vanilla/features/icons';
import { SwiperComponent } from '@frontend/vanilla/shared/swiper';
import { Swiper, SwiperOptions } from 'swiper/types';

import { BalanceBreakdownItemBase } from '../balance-breakdown-item-base';
import { BalanceBreakdownTrackingService } from '../balance-breakdown-tracking.service';

@Component({
    standalone: true,
    imports: [CommonModule, DynamicComponentDirective, SwiperComponent, IconCustomComponent],
    selector: 'vn-bb-slider',
    templateUrl: 'slider.html',
    styleUrls: ['../../../../../../themepark/themes/whitelabel/components/balance-breakdown/bb-slider/styles.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class BalanceBreakdownSliderComponent extends BalanceBreakdownItemBase implements OnInit, AfterViewInit {
    @ViewChild(SwiperComponent) carousel: SwiperComponent;

    swiperConfig: SwiperOptions = {
        slideToClickedSlide: true,
        centeredSlides: true,
    };
    sortedItems: MenuContentItem[];
    currentIndex: number = 0;

    constructor(
        public device: DeviceService,
        private page: Page,
        private balanceTrackingService: BalanceBreakdownTrackingService,
        private timerService: TimerService,
        private ngZone: NgZone,
    ) {
        super();
    }

    ngOnInit() {
        //Sort again to make current product as first item.
        this.sortedItems = this.item.children.sort((item: MenuContentItem) => {
            return item.name == this.page.product ? -1 : 0;
        });

        this.swiperConfig.navigation = !!toBoolean(this.item.parameters.arrows);
        this.swiperConfig.slidesPerView = this.item.parameters['slides-per-view'] as any;
        this.swiperConfig.pagination = !!toBoolean(this.item.parameters.dots);
    }

    ngAfterViewInit() {
        if (this.item.children.length === 1) {
            this.timerService.setTimeout(() => {
                this.balanceBreakdownService.isSingleProduct.set(true);
            });
        }

        let currentProductItem = this.sortedItems.find((item: MenuContentItem) => item.name == this.page.product);

        // if current product does not exist in slider, set first one as default
        if (!currentProductItem && this.sortedItems.length > 0) {
            currentProductItem = this.sortedItems[0];
        }

        if (currentProductItem) {
            this.balanceBreakdownService.slide.set(currentProductItem);
            this.trackProductLoad(currentProductItem);

            if (this.sortedItems.length > 1) {
                const swiperInstance = this.carousel.swiper;
                swiperInstance.on('slideChange', (swiperReference) => {
                    this.ngZone.run(() => {
                        this.sliderChanged(swiperReference);
                    });
                });
                swiperInstance.slideTo(this.item.children.indexOf(currentProductItem));
            }
        }
    }

    sliderChanged(swiper: Swiper) {
        this.currentIndex = swiper.activeIndex;
        const currentItem = this.item.children[this.currentIndex];
        if (currentItem) {
            this.balanceBreakdownService.slide.set(currentItem);
            this.trackProductLoad(currentItem);
        }
    }

    goToSlide(index: number) {
        this.carousel.swiper.slideTo(index);
    }

    trackProductLoad(currentItem: MenuContentItem) {
        this.balanceTrackingService.trackProductLoad(currentItem.text);
    }
}
