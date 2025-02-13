import { Injectable } from '@angular/core';

import { Observable, Subject, of } from 'rxjs';
import { buffer, debounceTime, first, map } from 'rxjs/operators';

import { DslCacheRecord } from './dsl.models';

/**
 * @whatItDoes Serves as a cache for DSL expressions
 *
 * @description
 *
 * Result of every evaluated DSL expression (using {@link DslEnvService}) is stored in the cache until such time,
 * that one of the dependencies of the expression is invalidated using the `invalidate` method.
 *
 * When the expression is executed, DSL providers created using {@link DslRecorderService} record all accessed properties and store
 * the keys of those (including arguments in case of functions) as a dependency of the expression.
 *
 * @stable
 */
@Injectable({
    providedIn: 'root',
})
export class DslCacheService {
    private cache: Map<string, DslCacheRecord> = new Map();
    private watch: { [ref: string]: number } = {};
    private isStable: boolean = true;
    private invalidateEvents = new Subject<Set<string>>();
    private stableEvents = new Subject<void>();

    constructor() {
        this.invalidation.pipe(debounceTime(0)).subscribe(() => {
            this.isStable = true;
            this.stableEvents.next();
        });
    }

    get invalidation(): Observable<Set<string>> {
        return this.invalidateEvents.pipe(
            buffer(this.invalidateEvents.pipe(debounceTime(0))),
            map((buffer: Set<string>[]) =>
                buffer.reduce((a: Set<string>, s: Set<string>) => {
                    s.forEach((i: string) => a.add(i));
                    return a;
                }, new Set()),
            ),
        );
    }

    /** @internal */
    whenStable(): Observable<void> {
        return this.isStable ? of<void>(void 0) : this.stableEvents.pipe(first());
    }

    get(expression: string): DslCacheRecord | undefined {
        return this.cache.get(expression);
    }

    set(expression: string, result: boolean, dependencies: Set<string>, notReady?: boolean) {
        const dslRecord: DslCacheRecord = { result, dependencies, notReady };

        this.cache.set(expression, dslRecord);

        dependencies.forEach((dep: string) => (this.watch[dep] = ~~this.watch[dep]! + 1));
    }

    invalidate(refs: string[]) {
        refs = refs.filter((r: string) => this.watch[r]);

        if (!refs.length) {
            return;
        }

        this.isStable = false;
        const invalidated = new Set<string>();

        this.cache.forEach((value: DslCacheRecord, key: string) => {
            for (const ref of refs) {
                if (value.dependencies.has(ref)) {
                    value.dependencies.forEach((dep: string) => {
                        if (this.watch[dep]) {
                            this.watch[dep]--;
                        }
                    });

                    this.cache.delete(key);
                    invalidated.add(ref);
                    break;
                }
            }
        });

        this.invalidateEvents.next(invalidated);
    }
}
