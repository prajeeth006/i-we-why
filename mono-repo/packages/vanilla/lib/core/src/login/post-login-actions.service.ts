import { Injectable } from '@angular/core';

import { LastKnownProductService } from '../last-known-product/last-known-product.service';
import { CashierService } from '../lazy/service-providers/cashier.service';
import { GoToOptions } from '../navigation/navigation.models';
import { NavigationService } from '../navigation/navigation.service';
import { UrlService } from '../navigation/url.service';
import { LoginNavigationService } from './login-navigation.service';
import { PostLoginActionHandler } from './login.models';

@Injectable({
    providedIn: 'root',
})
export class PostLoginActionsService {
    private handlers = new Map<string, PostLoginActionHandler>();

    constructor(
        private navigationService: NavigationService,
        private loginNavigationService: LoginNavigationService,
        private lastKnownProduct: LastKnownProductService,
        private cashierService: CashierService,
        private urlService: UrlService,
    ) {
        this.register('goToCashierDeposit', (_origin: string, options?: GoToOptions) => this.goToCashierDeposit(options));
        this.register('goToRedirectUrl', (_origin: string, options?: GoToOptions) => this.goToRedirectUrl(options));
    }

    register(name: string, fn: PostLoginActionHandler) {
        this.handlers.set(name, fn);
    }

    invoke(fname: string | undefined, args?: any[]): Promise<void> {
        args = args || [];
        let fn: PostLoginActionHandler | undefined;

        if (fname) {
            fn = this.handlers.get(fname);
        }

        if (fname && fn instanceof Function) {
            const result = fn.apply(null, [fname, ...args]);

            if (result?.then) {
                return result;
            } else {
                return Promise.resolve();
            }
        }

        return Promise.reject(`Handler for post login action ${fname} not found.`);
    }

    private goToCashierDeposit(options?: GoToOptions) {
        const opts = options || {};
        const returnUrl = this.urlService.parse(this.lastKnownProduct.get().url);

        if (opts.culture) {
            returnUrl.changeCulture(opts.culture);
        }

        return this.cashierService.goToCashierDeposit({
            returnUrl: returnUrl.absUrl(),
            cashierTargetWindow: opts.forceReloadTarget || null,
            queryParameters: { ['showKYCVerifiedMessage']: 'true' },
        });
    }

    private goToRedirectUrl(options?: GoToOptions) {
        const storedRedirectInfo = this.loginNavigationService.getStoredLoginRedirect();
        const mergedOptions = Object.assign({}, storedRedirectInfo.options, options);

        if (storedRedirectInfo.url) {
            this.navigationService.goTo(storedRedirectInfo.url, mergedOptions);
        }
    }
}
