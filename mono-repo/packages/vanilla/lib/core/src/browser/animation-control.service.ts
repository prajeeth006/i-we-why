import { Injectable } from '@angular/core';

import { AnimationControl, ElementPredicate } from './browser.models';

/**
 * @whatItDoes Allows to specify condition based on HTML element whether to run angular animation or not.
 *
 * @stable
 */
@Injectable({
    providedIn: 'root',
})
export class AnimationControlService {
    private conditions: ElementPredicate[] = [];

    /** @internal */
    shouldAnimate(element: HTMLElement): boolean {
        return this.conditions.every((e: ElementPredicate) => e(element) !== AnimationControl.Disable);
    }

    addCondition(checker: ElementPredicate) {
        this.conditions.unshift(checker);
    }

    clear() {
        this.conditions = [];
    }
}
