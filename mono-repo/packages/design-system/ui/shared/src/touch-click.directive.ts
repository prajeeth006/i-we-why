import { DestroyRef, Directive, ElementRef, NgZone, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { filter, fromEvent, tap } from 'rxjs';

import { IS_SAFARI_BROWSER } from './safari-browser-token.interface';

@Directive({
    selector: '[dsTouchClick]',
    standalone: true,
})
export class DsTouchClickDirective implements OnInit {
    private el = inject(ElementRef);
    private ngZone = inject(NgZone);
    private destroyRef = inject(DestroyRef);
    private isSafariBrowser = inject(IS_SAFARI_BROWSER);

    private touchStartElement: HTMLElement | null = null;

    private touchStarted$ = fromEvent<TouchEvent>(this.el.nativeElement, 'touchstart');
    private touchMoved$ = fromEvent<TouchEvent>(this.el.nativeElement, 'touchmove');
    private touchEnded$ = fromEvent<TouchEvent>(this.el.nativeElement, 'touchend');

    ngOnInit() {
        if (!this.isSafariBrowser) {
            return;
        }
        const clickTrigger = this.touchEnded$.pipe(
            filter(() => this.touchStartElement != null),
            tap((event: TouchEvent) => {
                if (this.touchStartElement != null && event.target === this.touchStartElement && event.changedTouches[0]) {
                    const clickEvent = new MouseEvent('click', {
                        bubbles: true,
                        cancelable: true,
                        view: window,
                        clientX: event.changedTouches[0].clientX,
                        clientY: event.changedTouches[0].clientY,
                    });
                    this.touchStartElement.dispatchEvent(clickEvent);
                    event.preventDefault();
                    this.touchStartElement = null;
                }
            }),
        );

        this.ngZone.runOutsideAngular(() => {
            this.touchStarted$
                .pipe(
                    tap((event: Event) => (this.touchStartElement = event.target as HTMLElement)),
                    takeUntilDestroyed(this.destroyRef),
                )
                .subscribe();

            this.touchMoved$
                .pipe(
                    tap(() => (this.touchStartElement = null)),
                    takeUntilDestroyed(this.destroyRef),
                )
                .subscribe();

            clickTrigger.pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
        });
    }
}
