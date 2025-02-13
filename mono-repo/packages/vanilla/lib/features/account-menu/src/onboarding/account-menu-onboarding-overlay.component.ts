import { OverlayRef } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgZone, OnInit, ViewChild, signal } from '@angular/core';

import { ContentItem, DynamicHtmlDirective, MenuContentItem, trackByProp } from '@frontend/vanilla/core';
import { PageMatrixDirective } from '@frontend/vanilla/features/content';
import { IconCustomComponent } from '@frontend/vanilla/features/icons';
import { AccountMenuConfig, AccountMenuOnboardingService } from '@frontend/vanilla/shared/account-menu';
import { DslPipe } from '@frontend/vanilla/shared/browser';
import { ImageComponent } from '@frontend/vanilla/shared/image';
import { SwiperComponent } from '@frontend/vanilla/shared/swiper';
import { Swiper, SwiperOptions } from 'swiper/types';

import { AccountMenuTrackingService } from '../account-menu-tracking.service';

@Component({
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, DynamicHtmlDirective, PageMatrixDirective, DslPipe, SwiperComponent, ImageComponent, IconCustomComponent],
    selector: 'vn-account-menu-onboarding-overlay',
    templateUrl: 'account-menu-onboarding-overlay.html',
})
export class AccountMenuOnboardingOverlayComponent implements OnInit {
    @ViewChild(SwiperComponent) carousel: SwiperComponent;

    showStartScreen: boolean = true;
    showGotItButton: boolean = false;
    content: MenuContentItem;
    tourItems: ContentItem[];
    bgPositionAnimation: number = 0;
    currentIndex: number = 0;
    indexSignal = signal<number>(0);
    bgWrapperImage: string;
    backgroundPositionAnimation: number;
    swiperRef: Swiper;
    readonly trackByName = trackByProp<ContentItem>('name');

    swiperConfig: SwiperOptions = {
        pagination: true,
        centeredSlides: true,
        on: {
            slideChange: (swiper) => {
                this.ngZone.run(() => {
                    this.indexChanged(swiper);
                });
            },
        },
    };

    constructor(
        private overlayRef: OverlayRef,
        public menuClientConfig: AccountMenuConfig,
        private accountMenuTrackingService: AccountMenuTrackingService,
        private accountMenuOnboardingService: AccountMenuOnboardingService,
        private ngZone: NgZone,
    ) {}

    ngOnInit() {
        this.content = this.menuClientConfig.onBoarding?.startTourScreen;
        this.tourItems = this.menuClientConfig.onBoarding?.tourItems;
        this.bgWrapperImage = `url(${this.content.url})`;
        this.backgroundPositionAnimation = this.content.parameters?.BackgroundPositionAnimation
            ? parseInt(this.content.parameters.BackgroundPositionAnimation)
            : 300;
    }

    startTour() {
        this.showStartScreen = false;
        this.bgPositionAnimation -= this.backgroundPositionAnimation;
        this.accountMenuTrackingService.trackStartOnboarding();
        this.accountMenuTrackingService.trackOnboardingLoad(this.currentIndex);
    }

    close(finished?: boolean) {
        this.overlayRef.detach();

        if (finished) {
            this.accountMenuOnboardingService.saveTourCompleted();
            this.accountMenuTrackingService.trackGotItOnboarding();
        } else {
            this.accountMenuTrackingService.trackCloseOnboarding(this.showStartScreen ? undefined : this.currentIndex);
        }
    }

    next() {
        this.carousel.swiper.slideNext();
        this.indexChanged(this.carousel.swiper);
        this.swiperRef = this.carousel.swiper;

        /* change modal-wrapper background position for the first slide on button click */
        if (this.currentIndex === 1) {
            this.bgPositionAnimation -= this.backgroundPositionAnimation;
        }
        this.accountMenuTrackingService.trackNextOnboarding(this.currentIndex);
        this.accountMenuTrackingService.trackOnboardingLoad(this.currentIndex);
    }

    previous() {
        this.carousel.swiper ? this.carousel.swiper.slidePrev() : this.swiperRef.slidePrev();
        this.indexChanged(this.swiperRef || this.carousel.swiper);

        /* change modal-wrapper background position for the first slide on button click */
        if (this.currentIndex === 0) {
            this.bgPositionAnimation += this.backgroundPositionAnimation;
        }
        this.accountMenuTrackingService.trackPreviousOnboarding(this.currentIndex);
    }

    indexChanged(swiper: Swiper) {
        const slides = swiper.slides;
        this.currentIndex = swiper.activeIndex;
        if (this.indexSignal() < this.currentIndex) {
            this.accountMenuTrackingService.trackNextOnboarding(this.currentIndex);
            this.accountMenuTrackingService.trackOnboardingLoad(this.currentIndex);
        } else {
            this.accountMenuTrackingService.trackPreviousOnboarding(this.currentIndex);
        }
        this.showGotItButton = slides.length === this.currentIndex + 1;
        this.indexSignal.set(this.currentIndex);
    }
}
