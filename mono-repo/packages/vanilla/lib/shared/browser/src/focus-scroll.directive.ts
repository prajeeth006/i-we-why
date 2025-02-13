import { Directive, ElementRef, Input, inject } from '@angular/core';

import { WINDOW, WindowEvent } from '@frontend/vanilla/core';

/**
 * @whatItDoes When truthy value is on input, it enables scroll for the element and disables scroll on the document.
 *
 * @stable
 */
@Directive({
    standalone: true,
    selector: '[vnFocusScroll]',
})
export class FocusScrollDirective {
    @Input() set vnFocusScroll(value: boolean) {
        this.update(value);
    }

    private readonly element: HTMLElement;
    private scrollPosY: number;
    private touchMoveHandler: (event: TouchEvent) => void;
    private touchStartHandler: (event: TouchEvent) => void;
    readonly #window = inject(WINDOW);

    constructor(elementRef: ElementRef) {
        this.element = elementRef.nativeElement;
    }

    private update(value: boolean) {
        if (value) {
            this.disableNativePageScrolling();
            this.enableElementScrolling();
        } else {
            this.scrollElementTop();
            this.enableNativePageScrolling();
            this.disableMenuScrolling();
        }
    }

    private disableNativePageScrolling() {
        this.#window.document.addEventListener(WindowEvent.TouchMove, this.noopHandler, false);
    }

    private enableNativePageScrolling() {
        this.#window.document.removeEventListener(WindowEvent.TouchMove, this.noopHandler, false);
    }

    private enableElementScrolling() {
        if (this.element) {
            this.touchStartHandler = this.snapshotYPos.bind(this);
            this.touchMoveHandler = this.scrollElementHandler.bind(this);

            this.element.addEventListener(WindowEvent.TouchStart, this.touchStartHandler, false);
            this.element.addEventListener(WindowEvent.TouchMove, this.touchMoveHandler, false);
        }
    }

    private disableMenuScrolling() {
        if (this.element) {
            this.element.removeEventListener(WindowEvent.TouchStart, this.touchStartHandler, false);
            this.element.removeEventListener(WindowEvent.TouchMove, this.touchMoveHandler, false);
        }
    }

    private noopHandler(event: Event) {
        event.preventDefault();
    }

    private snapshotYPos(event: TouchEvent) {
        this.scrollPosY = event.touches[0]!.clientY;
    }

    private scrollElementHandler(event: TouchEvent) {
        const currentY = event.touches[0]!.clientY;
        const distance = this.scrollPosY - currentY;
        this.scrollPosY = currentY;
        this.element.scrollTop += distance;

        event.preventDefault();
    }

    private scrollElementTop() {
        if (this.element) {
            this.element.scrollTop = 0;
        }
    }
}
