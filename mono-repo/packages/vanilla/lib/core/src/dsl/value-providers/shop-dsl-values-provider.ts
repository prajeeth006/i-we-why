import { Injectable } from '@angular/core';

import { CookieService } from '../../browser/cookie/cookie.service';
import { DslRecorderService } from '../dsl-recorder.service';
import { DslValueAsyncResolver, DslValueCacheKey } from '../dsl-value-async-resolver';
import { DslRecordable, DslValuesProvider } from '../dsl.models';

const SHOP_DSL_INVALIDATE_KEY = 'Shop';

@Injectable()
export class ShopDslValuesProvider implements DslValuesProvider {
    constructor(
        private dslRecorderService: DslRecorderService,
        private dslValueAsyncResolver: DslValueAsyncResolver,
        private cookieService: CookieService,
    ) {}

    getProviders(): { [provider: string]: DslRecordable } {
        return {
            Shop: this.dslRecorderService
                .createRecordable('shop')
                .createProperty({
                    name: 'BusinessUnit',
                    get: () => this.getShopDetails()?.businessUnit ?? '',
                    deps: [SHOP_DSL_INVALIDATE_KEY],
                })
                .createProperty({
                    name: 'Country',
                    get: () => this.getShopDetails()?.country ?? '',
                    deps: [SHOP_DSL_INVALIDATE_KEY],
                })
                .createProperty({
                    name: 'CurrencyCode',
                    get: () => this.getShopDetails()?.currencyCode ?? '',
                    deps: [SHOP_DSL_INVALIDATE_KEY],
                })
                .createProperty({
                    name: 'DefaultGateway',
                    get: () => this.getShopDetails()?.defaultGateway ?? '',
                    deps: [SHOP_DSL_INVALIDATE_KEY],
                })
                .createProperty({
                    name: 'Locale',
                    get: () => this.getShopDetails()?.locale ?? '',
                    deps: [SHOP_DSL_INVALIDATE_KEY],
                })
                .createProperty({
                    name: 'RegionAreaCode',
                    get: () => this.getShopDetails()?.regionAreaCode ?? '',
                    deps: [SHOP_DSL_INVALIDATE_KEY],
                })
                .createProperty({
                    name: 'RegionCode',
                    get: () => this.getShopDetails()?.regionCode ?? '',
                    deps: [SHOP_DSL_INVALIDATE_KEY],
                })
                .createProperty({
                    name: 'ShopId',
                    get: () => this.cookieService.get('shop_id') ?? '',
                    deps: [SHOP_DSL_INVALIDATE_KEY],
                })
                .createProperty({
                    name: 'ShopTier',
                    get: () => this.getShopDetails()?.shopTier ?? 0,
                    deps: [SHOP_DSL_INVALIDATE_KEY],
                })
                .createProperty({
                    name: 'SubRegionCode',
                    get: () => this.getShopDetails()?.subRegionCode ?? '',
                    deps: [SHOP_DSL_INVALIDATE_KEY],
                })
                .createProperty({
                    name: 'TimeZone',
                    get: () => this.getShopDetails()?.timeZone ?? '',
                    deps: [SHOP_DSL_INVALIDATE_KEY],
                })
                .createProperty({
                    name: 'Validated',
                    get: () => this.getShopDetails()?.validated ?? '',
                    deps: [SHOP_DSL_INVALIDATE_KEY],
                })
                .createProperty({
                    name: 'SitecoreShopGroups',
                    get: () => this.getShopDetails()?.sitecoreShopGroups ?? '',
                    deps: [SHOP_DSL_INVALIDATE_KEY],
                }),
        };
    }

    private getShopDetails() {
        return this.dslValueAsyncResolver.resolve({
            cacheKey: DslValueCacheKey.SHOP,
            endpoint: 'shop',
            invalidateKey: SHOP_DSL_INVALIDATE_KEY,
            get: (data) => data?.shopDetails,
        });
    }
}
