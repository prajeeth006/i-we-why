import { AfterViewInit, Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';

import { CommonTimers } from './models/common.model';

@Directive({
    selector: '[gnDividendsVScroll]',
})
export class DividendsVScrollDirective implements OnInit, AfterViewInit {
    haveAutoScroll: boolean = false;
    scrollInterval: number = CommonTimers.FcTcTimer;

    @Input() set gnDividendsVScroll(hasScroll: boolean) {
        this.haveAutoScroll = hasScroll;
        if (hasScroll) {
            this.renderer.addClass(this.el.nativeElement, 'auto-scroll_vertical');
        }
    }

    constructor(
        private el: ElementRef,
        private renderer: Renderer2,
    ) {}

    ngOnInit(): void {
        this.loadStyles();
    }

    ngAfterViewInit(): void {
        if (this.haveAutoScroll) {
            this.setupAutoScroll();
        }
    }

    private loadStyles(): void {
        const style = document.createElement('style');
        style.innerHTML = `
      /* Your SCSS styles go here */
      .auto-scroll_vertical{position:relative;}
      .auto-scroll_vertical span {transform: translateY(100%);position: absolute;}
      .auto-scroll_vertical span.active {transform: translateY(0%);transition: transform 0.45s ease-in-out;}
      .auto-scroll_vertical span.previous {transform: translateY(-100%);transition: transform 0.5s ease-in-out;}
    `;
        document.head.appendChild(style);
    }

    private showSlides(slideshowContainer: { children: any }) {
        let slideIndex = 0;
        const slides = slideshowContainer.children;

        function updateSlides() {
            for (let i = 0; i < slides.length; i++) {
                slides[i].classList.remove('active', 'previous');
            }

            const previousIndex = slideIndex;
            slideIndex++;

            if (slideIndex >= slides.length) {
                slideIndex = 0;
            }

            slides[slideIndex].classList.add('active');
            slides[previousIndex].classList.add('previous');

            // Add event listener to remove 'previous' class after transition completes
            slides[previousIndex].addEventListener(
                'transitionend',
                function () {
                    this.classList.remove('previous');
                },
                { once: true },
            );
        }

        // Add 'active' class to the first span by default
        slides[0].classList.add('active');

        // Start the interval after a delay
        setInterval(updateSlides, this.scrollInterval);
    }

    private setupAutoScroll(): void {
        this.showSlides(this.el.nativeElement);
    }
}
