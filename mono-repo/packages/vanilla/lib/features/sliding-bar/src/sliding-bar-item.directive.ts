import { Directive, ElementRef, Renderer2 } from '@angular/core';

/**
 * @howToUse
 *
 * ```
 *  <lh-sliding-bar>
 *     <div lhSlidingBarItem style="width:260px;height:100px;">Card 1</div>
 *     <div lhSlidingBarItem>Card 2</div>
 *     <div lhSlidingBarItem>Card 3</div>
 *     <div lhSlidingBarItem>Card 4</div>
 *  </lh-sliding-bar>
 * ```
 * @description
 *
 * This directive should be on the slider-bar items.
 *
 * @stable
 */

@Directive({
    standalone: true,
    selector: '[lhSlidingBarItem]',
    host: {
        '[style.flex]': '"0 0 auto"',
    },
})
export class SlidingBarItemDirective {
    constructor(
        private renderer: Renderer2,
        hostElement: ElementRef,
    ) {
        this.renderer.addClass(hostElement.nativeElement, 'sliding-bar-item');
    }
}
