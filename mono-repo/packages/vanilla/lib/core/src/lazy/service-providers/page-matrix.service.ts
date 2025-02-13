import { Injectable, Type } from '@angular/core';

import { LazyServiceProviderBase } from './lazy-service-provider-base';

/**
 * @whatItDoes Specifies which component to use to render a page matrix template
 *
 * @howToUse
 *
 * ```
 * m2PageMatrix.registerComponent('pccustom', MyComponent);
 * ```
 *
 * Keep in mind that the template name can be overridden by `render` or `template` key in `parameters` collection.
 *
 * @stable
 */
@Injectable({
    providedIn: 'root',
})
export class PageMatrixService extends LazyServiceProviderBase {
    registerComponent(templateName: string, component: Type<any>): void {
        this.inner.registerComponent(templateName, component);
    }
    getComponent(templateName: string): Type<any> | null {
        return this.getComponent(templateName);
    }
}
