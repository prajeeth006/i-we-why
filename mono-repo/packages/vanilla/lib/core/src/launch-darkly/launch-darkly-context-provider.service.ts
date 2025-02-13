import { Injectable, inject } from '@angular/core';

import { LDContext } from 'launchdarkly-js-client-sdk';
import { BehaviorSubject, Observable, distinctUntilChanged, filter } from 'rxjs';

import { ProductInjector } from '../products/product-injector';
import { LAUNCH_DARKLY_CONTEXT_PROVIDER, LaunchDarklyContextProvider } from './launch-darkly-context-provider';

@Injectable({
    providedIn: 'root',
})
export class LaunchDarklyContextProviderService {
    private contextChangedEvents: BehaviorSubject<LDContext | null> = new BehaviorSubject<LDContext | null>(null);

    /**
     * Return the current LDContext, without calling the providers again.
     */
    context: LDContext;

    get contextChanged(): Observable<LDContext | null> {
        return this.contextChangedEvents.pipe(
            filter((context) => context != null),
            distinctUntilChanged((previous: LDContext, current: LDContext) => JSON.stringify(previous) === JSON.stringify(current)),
        );
    }

    private readonly productInjector = inject(ProductInjector);

    /**
     * Reloads LDContext by fetching the providers again.
     */
    async reloadContext(lazyContext?: LDContext) {
        await this.getContext(lazyContext);
    }

    /**
     * Get all Context injectors and return the generated LDContext.
     */
    async getContext(lazyContext?: LDContext): Promise<LDContext> {
        const providers = this.productInjector.getMultiple<LaunchDarklyContextProvider>(LAUNCH_DARKLY_CONTEXT_PROVIDER);

        for (let index = 0; index < providers.length; index++) {
            const contexts = await providers[index]?.getProviders();
            this.context = Object.assign({}, this.context, contexts);
        }

        if (lazyContext) {
            this.context = Object.assign({}, this.context, lazyContext);
        }

        this.contextChangedEvents.next(this.context);
        return this.context;
    }
}
