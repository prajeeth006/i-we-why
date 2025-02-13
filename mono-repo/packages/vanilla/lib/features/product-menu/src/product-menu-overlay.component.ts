import { AnimationEvent, animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { TimerService } from '@frontend/vanilla/core';
import { AnimatedOverlayRef } from '@frontend/vanilla/features/overlay';

import { ProductMenuComponent } from './product-menu.component';

@Component({
    standalone: true,
    imports: [ProductMenuComponent],
    selector: 'vn-product-menu-overlay',
    templateUrl: 'product-menu-overlay.html',
    animations: [
        trigger('flyInOut', [
            state('left', style({ transform: 'translateX(-100%)' })),
            state('right', style({ transform: 'translateX(0)' })),
            state('bottom', style({ transform: 'translateY(100%)' })),
            state('top', style({ transform: 'translateY(0)' })),
            transition('left => right', animate('500ms ease-out')),
            transition('right => left', animate('500ms ease-in')),
            transition('bottom => top', animate('500ms ease-out')),
            transition('top => bottom', animate('500ms ease-in')),
        ]),
    ],
    styleUrls: ['../../../../../themepark/themes/whitelabel/components/product-menu/styles.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class ProductMenuOverlayComponent implements OnInit {
    state: string | undefined;

    constructor(
        private overlayRef: AnimatedOverlayRef,
        private timerService: TimerService,
    ) {}

    ngOnInit() {
        if (this.overlayRef.shouldAnimate) {
            this.state = this.overlayRef.states.initial;

            this.overlayRef.beforeClose().subscribe(() => {
                this.state = this.overlayRef.states.off;
            });

            this.timerService.setTimeout(() => {
                this.state = this.overlayRef.states.on;
            });
        }
    }

    onAnimationEvent(event: AnimationEvent) {
        this.overlayRef.onAnimationEvent(event);
    }
}
