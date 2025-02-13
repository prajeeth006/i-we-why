import { Injectable, computed, inject, signal } from '@angular/core';

import { CookieName, CookieService, LastKnownProductConfig, LastKnownProductService } from '@frontend/vanilla/core';
import { firstValueFrom } from 'rxjs';

import { ProductSwitchCoolOffResourceService } from './product-switch-cool-off-resource.service';

const DEFAUL_PREVIOUS_COOKIE_VALUE = 'unknown';

@Injectable()
export class ProductSwitchCoolOffService {
    private cookieService = inject(CookieService);
    private lastKnownProductConfig = inject(LastKnownProductConfig);
    private lastKnownProductService = inject(LastKnownProductService);
    private productSwitchCoolOffResourceService = inject(ProductSwitchCoolOffResourceService);

    /* indicates if the product switch cool off overlay should be shown */
    shouldShow = computed(
        () => this.lastKnownProductService.get()?.previous !== DEFAUL_PREVIOUS_COOKIE_VALUE && this.isCurrentProductDifferentThenLastCooledOff(),
    );

    /* indicates if on first label load lastCoolOffProduct cookie should be written, for easier checking if overlay should be shown on other products */
    shouldWriteLastCoolOffProductOnBootstrap = computed(
        () => this.lastKnownProductService?.get().previous === DEFAUL_PREVIOUS_COOKIE_VALUE && !this.lastCoolOffProduct(),
    );

    private isCurrentProductDifferentThenLastCooledOff = computed(() => this.lastKnownProductConfig.product !== this.lastCoolOffProduct());
    private lastCoolOffProduct = signal<string>(this.cookieService.get(CookieName.LastCoolOffProduct));

    setLastCoolOffProduct() {
        this.cookieService.putRaw(CookieName.LastCoolOffProduct, this.lastKnownProductConfig.product);
    }

    async setPlayerArea() {
        const lastKnownProduct = this.lastKnownProductService.get();
        await firstValueFrom(this.productSwitchCoolOffResourceService.setPlayerArea(lastKnownProduct.name, lastKnownProduct.previous));
    }
}
