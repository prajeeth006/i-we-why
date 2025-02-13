import { animate, state, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, NgZone } from '@angular/core';

import { Toast, ToastPackage, ToastrService } from 'ngx-toastr';

import { SwipeDirection, SwipeDirective } from '../browser/swipe.directive';
import { DynamicHtmlDirective } from '../dynamic-layout/dynamic-html.directive';

/**
 * @stable
 */
@Component({
    standalone: true,
    imports: [CommonModule, DynamicHtmlDirective, SwipeDirective],
    selector: 'vn-toastr',
    templateUrl: 'toastr.html',
    animations: [
        trigger('flyInOut', [
            state('inactive', style({ opacity: 0 })),
            state('active', style({ opacity: 1 })),
            state('swiped-right', style({ transform: 'translateX(100%)' })),
            state('removed', style({ opacity: 0 })),
            transition('inactive => active', animate('{{ easeTime }}ms {{ easing }}')),
            transition('active => removed', animate('{{ easeTime }}ms {{ easing }}')),
            transition('active => swiped-right', animate('{{ easeTime }}ms {{ easing }}')),
        ]),
    ],
})
export class ToastrComponent extends Toast {
    constructor(
        protected override toastrService: ToastrService,
        public override toastPackage: ToastPackage,
        protected zone: NgZone,
    ) {
        super(toastrService, toastPackage, zone);
    }

    onSwipe(direction: SwipeDirection) {
        if (direction === SwipeDirection.Right) {
            this.state = { ...this.state, value: 'removed' };
            this.outsideTimeout(() => this.remove(), +this.toastPackage.config.easeTime);
        }
    }
}
