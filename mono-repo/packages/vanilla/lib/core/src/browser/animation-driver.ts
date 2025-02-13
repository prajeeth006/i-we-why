import { AnimationPlayer } from '@angular/animations';
import { AnimationDriver as AngularAnimationDriver, ɵWebAnimationsDriver } from '@angular/animations/browser';
import { Injectable } from '@angular/core';

import { AnimationControlService } from './animation-control.service';

@Injectable()
export class AnimationDriver extends ɵWebAnimationsDriver {
    constructor(private animationControlService: AnimationControlService) {
        super();
    }

    override animate(element: any, keyframes: any[], duration: number, delay: number, easing: string, previousPlayers?: AnimationPlayer[]): any {
        return this.animationControlService.shouldAnimate(element)
            ? super.animate(element, keyframes, duration, delay, easing, previousPlayers)
            : AngularAnimationDriver.NOOP.animate(element, keyframes, duration, delay, easing, previousPlayers);
    }
}
