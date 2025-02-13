import { Injectable, Type } from '@angular/core';

import { DynamicComponentsRegistry, VanillaDynamicComponentsCategory } from '@frontend/vanilla/core';

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
export class PageMatrixService {
    constructor(private dynamicComponentsRegistry: DynamicComponentsRegistry) {}

    registerComponent(templateName: string, component: Type<any>) {
        this.dynamicComponentsRegistry.registerComponent(VanillaDynamicComponentsCategory.PageMatrix, templateName.toLowerCase(), component);
    }

    getComponent(templateName: string) {
        return this.dynamicComponentsRegistry.get(VanillaDynamicComponentsCategory.PageMatrix, templateName.toLowerCase());
    }
}
