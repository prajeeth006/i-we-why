import { Directive, EventEmitter, HostListener, Output } from '@angular/core';

/**
 * @stable
 */
export enum SwipeDirection {
    Left = 'Left',
    Right = 'Right',
    Up = 'Up',
    Down = 'Down',
}

/**
 * @whatItDoes Provides swipe detection for mobile devices.
 *
 * @howToUse
 *
 * ```
 * <div vnSwipe (onSwipe)="swipe($event)"></div>
 * ```
 * ---
 * ```
 * swipe(direction: SwipeDirection) {
 *   if (direction === SwipeDirection.Left) {
 *      // Handle left swipe
 *   }
 * }
 * ```
 *
 * @stable
 */
@Directive({
    selector: '[vnSwipe]',
    standalone: true,
})
export class SwipeDirective {
    @Output() onSwipe = new EventEmitter<SwipeDirection>();

    private swipeCoordinates: any = [0, 0];
    private swipeTime = new Date().getTime();

    @HostListener('touchstart', ['$event']) onTouchStart($event: TouchEvent) {
        this.swipe($event, 'start');
    }

    @HostListener('touchend', ['$event']) onTouchEnd($event: TouchEvent) {
        this.swipe($event, 'end');
    }

    private swipe(event: TouchEvent, when: string) {
        const clientX = event.changedTouches[0]?.clientX;
        const clientY = event.changedTouches[0]?.clientY;

        if (clientX === undefined || clientY === undefined) {
            return;
        }

        const coordinates: any = [clientX, clientY];
        const time = new Date().getTime();

        if (when === 'start') {
            this.swipeCoordinates = coordinates;
            this.swipeTime = time;
        } else if (when === 'end') {
            const direction: any = [coordinates[0] - this.swipeCoordinates[0], coordinates[1] - this.swipeCoordinates[1]];
            const duration = time - this.swipeTime;

            if (duration < 1000) {
                if (Math.abs(direction[0]) > 30 && Math.abs(direction[0]) > Math.abs(direction[1] * 3)) {
                    // Horizontal enough
                    const swipeDirection = direction[0] < 0 ? SwipeDirection.Left : SwipeDirection.Right;

                    this.onSwipe.emit(swipeDirection);
                } else if (Math.abs(direction[1]) > 30 && Math.abs(direction[1]) > Math.abs(direction[0] * 3)) {
                    // Vertical enough
                    const swipeDirection = direction[1] < 0 ? SwipeDirection.Up : SwipeDirection.Down;

                    this.onSwipe.emit(swipeDirection);
                }
            }
        }
    }
}
