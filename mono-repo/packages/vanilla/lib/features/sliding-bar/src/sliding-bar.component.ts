import { AnimationBuilder, AnimationFactory, AnimationPlayer, animate, style } from '@angular/animations';
import { CommonModule } from '@angular/common';
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ContentChildren,
    ElementRef,
    OnDestroy,
    OnInit,
    QueryList,
    ViewChild,
    computed,
    inject,
    signal,
} from '@angular/core';

import { DsArrow } from '@frontend/ui/arrow';
import { DeviceService, TimerService, WINDOW } from '@frontend/vanilla/core';
import { IconCustomComponent } from '@frontend/vanilla/features/icons';
import { SubscriptionLike, fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { SlidingBarItemDirective } from './sliding-bar-item.directive';

/**
 * @whatItDoes This is a slider bar/carousel container.
 *
 * @howToUse
 *
 * Add the component to the page and add the sliding items as the component content.
 * ```
 *  <lh-sliding-bar>
 *     <div lhSlidingBarItem style="width:260px;height:100px;">Card 1</div>
 *     <div lhSlidingBarItem>Card 2</div>
 *     <div lhSlidingBarItem>Card 3</div>
 *     <div lhSlidingBarItem>Card 4</div>
 *  </lh-sliding-bar>
 * ```
 *
 * @description
 *
 * This Container will create a carousel out of the items.
 * It is responsive, when the page is in mobile view the sliding will work with touch, else two buttons will appear for "next, previous".
 *
 *
 * @stable
 */

@Component({
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, DsArrow, IconCustomComponent],
    selector: 'lh-sliding-bar',
    templateUrl: 'sliding-bar.component.html',
})
export class SlidingBarComponent implements OnInit, AfterViewInit, OnDestroy {
    @ContentChildren(SlidingBarItemDirective, { read: ElementRef }) items: QueryList<ElementRef>;
    @ViewChild('carousel') private carousel: ElementRef;

    mobileView = signal<boolean>(this.deviceService.isTouch);
    hasNext = computed(() => this.currentSlide() + 1 !== this.items.length);
    hasPrev = computed(() => this.currentSlide() !== 0);

    private currentSlide = signal<number>(0);
    private itemWidth: number;
    private slidingTiming = '250ms ease-in';
    private player: AnimationPlayer;
    private resizeSub: SubscriptionLike;
    readonly #window = inject(WINDOW);

    constructor(
        private builder: AnimationBuilder,
        private deviceService: DeviceService,
        private timerService: TimerService,
    ) {}

    ngOnInit() {
        this.resizeSub = fromEvent(this.#window, 'resize')
            .pipe(debounceTime(350))
            .subscribe(() => this.setItemsWidth());
    }

    ngAfterViewInit() {
        this.setItemsWidth();
    }

    ngOnDestroy() {
        if (this.resizeSub) {
            this.resizeSub.unsubscribe();
        }
    }

    next() {
        if (!this.hasNext()) return;

        this.currentSlide.update((v) => v + 1);
        const offset = this.currentSlide() * this.itemWidth;
        this.runSlideAnimation(offset);
    }

    prev() {
        if (!this.hasPrev()) return;

        this.currentSlide.update((v) => v - 1);
        const offset = this.currentSlide() * this.itemWidth;
        this.runSlideAnimation(offset);
    }

    private setItemsWidth() {
        this.timerService.setTimeout(() => {
            if (this.items?.first) {
                const rect = this.items.first.nativeElement.getBoundingClientRect();

                if (rect.width > 0) {
                    this.itemWidth = rect.width;
                    this.runSlideAnimation(this.currentSlide() * this.itemWidth);
                }
            }
        });
    }

    private runSlideAnimation(offset: number) {
        const myAnimation: AnimationFactory = this.builder.build([animate(this.slidingTiming, style({ transform: `translateX(-${offset}px)` }))]);
        this.player = myAnimation.create(this.carousel.nativeElement);
        this.player.play();
    }
}
