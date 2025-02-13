import { Injectable } from '@angular/core';

import { ComponentType } from 'ngx-toastr';

/**
 * @whatItDoes Specifies which component to use to render a custom toast
 *
 * @howToUse
 *
 * ```
 * toastrDynamicComponentsRegistry.registerComponent('redToastr', MyToastrComponent);
 * ```
 *
 * @experimental
 */
@Injectable({
    providedIn: 'root',
})
export class ToastrDynamicComponentsRegistry {
    private componentRegistrations: Map<string, ComponentType<any>> = new Map();

    registerComponent(name: string, componentType: ComponentType<any>) {
        this.componentRegistrations.set(name, componentType);
    }

    /** @internal */
    get(name: string): ComponentType<any> | undefined {
        return this.componentRegistrations.get(name) || undefined;
    }
}
