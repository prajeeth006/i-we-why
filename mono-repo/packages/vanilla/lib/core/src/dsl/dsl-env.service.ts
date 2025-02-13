import { Injectable } from '@angular/core';

import { Observable, Subject } from 'rxjs';

import { Logger } from '../logging/logger';
import { ProductInjector } from '../products/product-injector';
import { ProductService } from '../products/product.service';
import { UserService } from '../user/user.service';
import { DslCacheService } from './dsl-cache.service';
import { DSL_NOT_READY, DslRecorderService } from './dsl-recorder.service';
import { DSL_VALUES_PROVIDER } from './dsl-values-provider';
import { DslContext, DslEnvExecutionMode, DslEnvResult, DslValuesProvider } from './dsl.models';

interface UnregisteredDslProvider {
    expression: string;
    functionRegex: RegExp;
    propertyRegex: RegExp;
}

/**
 * @whatItDoes Runs vanilla DSL expressions and returns a result.
 *
 * @howToUse
 *
 * ```
 * const result = this.dslEnvService.run(expression);
 * ```
 *
 * @description
 *
 * Low level service for evaluating DSL expressions.
 *
 * @stable
 */
@Injectable({
    providedIn: 'root',
})
export class DslEnvService {
    private context: DslContext = {};
    private changeEvents = new Subject<Set<string>>();

    constructor(
        private dslRecorderService: DslRecorderService,
        private dslCacheService: DslCacheService,
        private productInjector: ProductInjector,
        private productService: ProductService,
        private userService: UserService,
        private log: Logger,
    ) {
        this.dslCacheService.invalidation.subscribe((deps: Set<string>) => this.changeEvents.next(deps));

        //Necessary for embedded products as the change from host to another product happens without page refresh and might run later so dsl context won't have the providers for cached expressions.
        this.productService.productChanged.subscribe(() => this.getContext());
    }

    get change(): Observable<Set<string>> {
        return this.changeEvents;
    }

    private _notRegisteredRecordables: UnregisteredDslProvider[] = [];
    private _defaultValuesNotReadyDslProviders: { [key: string]: string | boolean | number } = {};

    /**
     * List of recordables not registered due to module not yet loaded.
     */
    get notRegisteredRecordables(): UnregisteredDslProvider[] {
        return this._notRegisteredRecordables;
    }

    whenStable(): Observable<void> {
        return this.dslCacheService.whenStable();
    }

    run(expression: string, executionMode = DslEnvExecutionMode.Expression): DslEnvResult {
        let dslResult: DslEnvResult = { result: undefined, deps: new Set() };

        if (!expression) {
            dslResult = { result: true, deps: new Set() };

            return dslResult;
        }

        if (executionMode === DslEnvExecutionMode.Expression) {
            const cached = this.dslCacheService.get(expression);

            if (cached) {
                this.log.debug(`eval DSL ${expression} to ${cached.result} (cached)`);

                dslResult = { result: cached.result, deps: cached.dependencies, notReady: cached.notReady };

                return dslResult;
            }
        }

        this.dslRecorderService.beginRecording();

        const context = this.getContext();
        // filter only unregistered DSL providers that exists in expression.
        const notRegisteredDeps = this._notRegisteredRecordables.filter((x: UnregisteredDslProvider) => expression.match(x.propertyRegex));

        dslResult.notReady = false;

        if (this.userService.isAuthenticated && notRegisteredDeps.length > 0) {
            dslResult.notReady = true;
            dslResult.error = new Error(
                `Expression contains DSL providers not yet registered: ${notRegisteredDeps.map((provider) => provider.expression).join(',')}.`,
            );
        } else {
            try {
                const fn = this.buildFunction(expression, executionMode, notRegisteredDeps);
                dslResult.result = fn.call(null, context);
            } catch (err: any) {
                if (err.message === DSL_NOT_READY) {
                    dslResult.notReady = true;
                } else {
                    dslResult.error = err;
                    this.log.errorRemote(`Error occurred when evaluating DSL '${expression}'`, err);
                }
            }
        }

        const recording = this.dslRecorderService.endRecording();
        dslResult.deps = recording.deps;

        //Manually add not registered deps as create recordable did not run yet for them. So when they load cache can be invalidated forcing reevaluation.
        notRegisteredDeps.forEach((x: UnregisteredDslProvider) => {
            const lowerCaseDep = x.expression.split('.')[1]?.toLowerCase();
            if (lowerCaseDep) {
                dslResult.deps.add(lowerCaseDep);
            }
        });

        this.log.debug(`eval DSL ${expression} to ${dslResult.result}`);
        this.dslCacheService.set(expression, dslResult.result, dslResult.deps, dslResult.notReady);

        return dslResult;
    }

    registerDefaultValuesNotReadyDslProviders(defaultValues: { [key: string]: string | boolean | number }) {
        this._defaultValuesNotReadyDslProviders = { ...this._defaultValuesNotReadyDslProviders, ...defaultValues };
        this._notRegisteredRecordables.push(
            ...Object.keys(defaultValues).map((x: string) => ({
                expression: x,
                functionRegex: new RegExp(`${x}\\s*\\([^()]*\\)`, 'ig'),
                propertyRegex: new RegExp(`\\b${x}\\b`, 'ig'),
            })),
        );
    }

    addToContext(factories: DslValuesProvider[]) {
        if (factories?.length > 0) {
            const newContext = factories.reduce((a: {}, p: DslValuesProvider) => this.enrichContext(a, p), {});
            Object.keys(newContext).forEach((provider: string) => this.lazyProviderReady(provider));

            this.context = Object.assign(this.context, newContext);
        }
    }

    private getContext(): DslContext {
        const factories = this.productInjector.getMultiple(DSL_VALUES_PROVIDER);
        const context = factories.reduce((a: {}, p: DslValuesProvider) => this.enrichContext(a, p), {});
        this.context = Object.assign(this.context, context);

        return this.context;
    }

    private enrichContext(context: object, provider: DslValuesProvider): Object & DslContext {
        const providers = provider.getProviders();

        for (const name in providers) {
            if (providers[name]) {
                providers[name].providerName = name;
            }
        }

        return Object.assign(context, providers);
    }

    private buildFunction(expression: string, executionMode: DslEnvExecutionMode, notRegisteredDeps: UnregisteredDslProvider[]): Function {
        let body: string;
        let modifiedExpression = expression;
        if (notRegisteredDeps.length > 0) {
            notRegisteredDeps.forEach((x: UnregisteredDslProvider) => {
                const replacement = this._defaultValuesNotReadyDslProviders[x.expression]?.toString() ?? '""';

                // Replace function calls
                modifiedExpression = modifiedExpression.replace(x.functionRegex, replacement);

                // Replace properties that matches
                modifiedExpression = modifiedExpression.replace(x.propertyRegex, replacement);
            });

            // 'Invalid left-hand side expression in postfix operation': that is caused when default value is negative number before which we have already - operator, ex: c.SessionFundSummary.Profit-c.SessionFundSummary.TotalStake => 20--1.
            // This is invalid expression because decrement can only be applied on variable.
            modifiedExpression = modifiedExpression.replace(/--/g, '- -');
        }

        switch (executionMode) {
            case DslEnvExecutionMode.Expression:
                body = `return (${modifiedExpression});`;
                break;
            case DslEnvExecutionMode.Action:
                body = modifiedExpression;
                break;
            default:
                throw new Error();
        }

        // eslint-disable-next-line @typescript-eslint/no-implied-eval
        return new Function('c', `"use strict"; ${body}`);
    }

    private lazyProviderReady(recordableKey: string) {
        // when provider is registred remove it from unregistered list
        this._notRegisteredRecordables = this.notRegisteredRecordables.filter(
            (x: UnregisteredDslProvider) => !x.expression.toLowerCase().startsWith(`c.${recordableKey.toLowerCase()}.`),
        );
        //Invalidate expressions that might have run before provider was registered so they can reevaluate
        this.dslCacheService.invalidate([recordableKey.toLowerCase()]);
    }
}
