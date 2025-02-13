import { Injectable } from '@angular/core';

import { cloneDeep, forOwn } from 'lodash-es';
import { Observable, Subscriber } from 'rxjs';
import { distinctUntilChanged, filter } from 'rxjs/operators';

import { DslEnvService } from './dsl-env.service';
import { DslEnvExecutionMode } from './dsl.models';

class DslEvaluationPlan {
    hasCondition: boolean;
    isArray: boolean;
    isProxy: boolean;
    items: { [key: string]: DslEvaluationPlan } | null = {};
    dslFields: string[] = [];
}

const ReplacerMarker = 'dsl:///';

/**
 * @whatItDoes Evaluates vanilla DSL expressions.
 *
 * @howToUse
 *
 * ```
 * this.dslService.evaluateContent(content).subscribe(c => this.content = c);
 * ```
 *
 * @stable
 */
@Injectable({
    providedIn: 'root',
})
export class DslService {
    constructor(private dslEnvService: DslEnvService) {}

    /**
     * Evaluates conditions on a specified content tree or array, and returns an observable
     * which, when subscribed to, returns the filtered content whenever a result of a condition changes.
     */
    evaluateContent<T>(content: T): Observable<T> {
        content = cloneDeep(content);

        return new Observable<T>((observer: Subscriber<T>) => {
            this.dslEnvService.whenStable().subscribe(() => {
                if (!content) {
                    observer.next(content);

                    return;
                }

                const plan = new DslEvaluationPlan();
                this.createPlan(content, plan);

                let dependencies = new Set<string>();

                const doFilter = () => {
                    const deps = new Set<string>();

                    if (plan.hasCondition && !this.evalExpression((<any>content).condition, deps)) {
                        observer.next({} as T);
                    } else if (!plan.items) {
                        observer.next(content);
                    } else {
                        observer.next(this.evaluateDsl(content, plan, deps));
                    }

                    dependencies = deps;
                };

                doFilter();

                observer.add(this.dslEnvService.change.pipe(filter((deps) => this.shouldReevaluate(dependencies, deps))).subscribe(() => doFilter()));
            });
        }).pipe(distinctUntilChanged((previous, current) => JSON.stringify(previous) === JSON.stringify(current)));
    }

    evaluateExpression<T>(expression: string): Observable<T> {
        return new Observable<T>((observer: Subscriber<T>) => {
            this.dslEnvService.whenStable().subscribe(() => {
                let dependencies = new Set<string>();

                const evaluate = () => {
                    const deps = new Set<string>();

                    const result = this.evalWithFullResult(expression, DslEnvExecutionMode.Expression, deps);

                    if (!result.notReady) {
                        observer.next(result.result);
                    }

                    dependencies = deps;
                };

                evaluate();

                observer.add(this.dslEnvService.change.pipe(filter((deps) => this.shouldReevaluate(dependencies, deps))).subscribe(() => evaluate()));
            });
        });
    }

    executeAction(action: string): Observable<void> {
        return new Observable<void>((observer: Subscriber<void>) => {
            this.dslEnvService.whenStable().subscribe(() => {
                let dependencies = new Set<string>();

                const execute = () => {
                    const deps = new Set<string>();
                    const result = this.evalWithFullResult(action, DslEnvExecutionMode.Action, deps);

                    if (!result.notReady) {
                        observer.next(result.result);
                    }

                    dependencies = deps;
                };

                execute();

                observer.add(this.dslEnvService.change.pipe(filter((deps) => this.shouldReevaluate(dependencies, deps))).subscribe(() => execute()));
            });
        });
    }

    private evaluateDsl(content: any, plan: DslEvaluationPlan, deps: Set<string>): any {
        let current = cloneDeep(content);

        if (plan.isProxy) {
            [current, plan] = this.evalProxy(current, plan, deps);

            if (!current) {
                return null;
            }
        }

        if (plan.isArray) {
            current = this.evalArray(current, plan, deps);
        } else {
            this.evalPlaceholders(current, plan, deps);
            this.evalRecursive(current, plan, deps);
        }

        return current;
    }

    private evalRecursive(content: any, plan: DslEvaluationPlan, deps: Set<string>) {
        forOwn(plan.items, (item: DslEvaluationPlan, key) => {
            if (item.isProxy) {
                [content[key], item] = this.evalProxy(content[key], item, deps);

                if (!content[key]) {
                    delete content[key];
                    return;
                }
            }

            if (item.hasCondition && !this.evalExpression(content[key].condition, deps)) {
                delete content[key];
            } else {
                this.evalPlaceholders(content[key], item, deps);

                if (item.items) {
                    if (item.isArray) {
                        content[key] = this.evalArray(content[key], item, deps);
                    } else {
                        this.evalRecursive(content[key], item, deps);
                    }
                }
            }
        });
    }

    private evalArray(content: any[], plan: DslEvaluationPlan, deps: Set<string>) {
        const array: any[] = [];

        content.forEach((value, index) => {
            let item = plan.items![index]!;

            if (!item) {
                array.push(value);
            } else {
                if (item.isProxy) {
                    [value, item] = this.evalProxy(value, item, deps);
                    if (!value) {
                        return;
                    }
                }

                if (!item.hasCondition || this.evalExpression(value.condition, deps)) {
                    this.evalPlaceholders(value, item, deps);

                    array.push(value);

                    if (item.items) {
                        this.evalRecursive(value, item, deps);
                    }
                }
            }
        });

        return array;
    }

    private evalProxy(content: any, plan: DslEvaluationPlan, deps: Set<string>): any[] {
        for (let i = 0; i < content.rules.length; i++) {
            const rule = content.rules[i];

            if (this.evalExpression(rule.condition, deps)) {
                const rulePlan = plan.items!['rules']!.items![i];
                const targetPlan = rulePlan == null || rulePlan.items == null ? new DslEvaluationPlan() : rulePlan.items['document']!;

                if (targetPlan.isProxy) {
                    return this.evalProxy(rule.document, targetPlan, deps);
                }

                return [rule.document, targetPlan];
            }
        }

        return [null, null];
    }

    private evalPlaceholders(content: any, plan: DslEvaluationPlan, deps: Set<string>) {
        plan.dslFields.forEach((fieldName: string) => {
            content[fieldName] = this.evalExpression(content[fieldName], deps);
        });
    }

    private evalExpression(expression: string, deps: Set<string>) {
        return this.evalWithFullResult(expression, DslEnvExecutionMode.Expression, deps).result;
    }

    private evalWithFullResult(expression: string, executionMode: DslEnvExecutionMode, deps: Set<string>) {
        const dslResult = this.dslEnvService.run(expression, executionMode);

        if (deps) {
            dslResult.deps.forEach((d: string) => deps.add(d));
        }

        return dslResult;
    }

    private shouldReevaluate(deps1: Set<string>, deps2: Set<string>): boolean {
        if (deps2.size < deps1.size) {
            [deps1, deps2] = [deps2, deps1];
        }

        for (const item1 of Array.from(deps1)) {
            if (deps2.has(item1)) {
                return true;
            }
        }

        return false;
    }

    private createPlan(content: any, plan: DslEvaluationPlan): number | boolean {
        plan.hasCondition = !!content.condition;
        plan.isArray = Array.isArray(content);
        plan.isProxy = !!content.isProxy;

        let childrenAreSpecial = false;

        forOwn(content, (value: any, key: string) => {
            if (typeof value === 'string' && value.startsWith(ReplacerMarker)) {
                content[key] = value.substring(ReplacerMarker.length);
                plan.dslFields.push(key);
            } else if (value instanceof Object) {
                plan.items = {
                    ...plan.items,
                    [key]: new DslEvaluationPlan(),
                };

                const childIsSpecial = this.createPlan(value, plan.items[key]!);

                if (childIsSpecial) {
                    childrenAreSpecial = true;
                } else {
                    delete plan.items[key];
                }
            }
        });

        if (!childrenAreSpecial) {
            plan.items = null;
        }

        return plan.hasCondition || plan.isProxy || plan.isArray || plan.dslFields.length || childrenAreSpecial;
    }
}
