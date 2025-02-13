import { Injectable } from '@angular/core';

import { LazyServiceProviderBase } from './lazy-service-provider-base';

@Injectable({
    providedIn: 'root',
})
export class IconFastCoreService extends LazyServiceProviderBase {
    getIconParameter(uniqueIconName: string, parameter: string): string {
        return this.inner.getIconParameter(uniqueIconName, parameter);
    }

    getAvailableValues(parameter: string, icon: any) {
        return this.inner.getAvailableValues(parameter, icon);
    }
}
