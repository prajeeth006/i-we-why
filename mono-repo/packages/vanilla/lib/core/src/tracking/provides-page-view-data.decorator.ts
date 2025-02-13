import { Type } from '@angular/core';

/**
 * @whatItDoes Decorates a component to instruct page view data infrastructure to wait for page data set with {@link PageViewDataService} from inside the component.
 *
 * @stable
 */
export function ProvidesPageViewData() {
    return function (cls: Type<any>) {
        Object.defineProperty(cls, 'ProvidesPageViewData', { value: true });
    };
}
