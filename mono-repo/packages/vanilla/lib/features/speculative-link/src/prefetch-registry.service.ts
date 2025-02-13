import { Injectable, Injector, NgZone, inject, runInInjectionContext } from '@angular/core';
import { PRIMARY_OUTLET, Params, Route, Router, Routes, UrlSegment, UrlSegmentGroup, UrlTree } from '@angular/router';

import { TimerService } from '@frontend/vanilla/core';
import { remove, uniqBy } from 'lodash-es';

import { MatcherService } from './matcher.service';
import { PATTERN_ALIAS, PathDetails, findPathDetails, getPreResolveRoutes } from './util';

@Injectable({ providedIn: 'root' })
export class PrefetchRegistry {
    readonly #router = inject(Router);
    readonly #injector = inject(Injector);
    readonly #ngZone = inject(NgZone);

    readonly #timerService = inject(TimerService);
    readonly #matcherService = inject(MatcherService);

    readonly #trees: UrlTree[] = [];
    readonly #routeToPreResolve = new Map<string, (() => void)[]>();
    readonly #preResolveRoutes: Route[] = [];
    readonly #preResolveExec = new WeakMap<() => void, number>();
    readonly #preResolveParams = new Map<Route, Map<string, () => void>>();
    readonly #THROTTLE_TIME = 15_000;

    add(tree: UrlTree) {
        this.#trees.push(tree);
        this.#setLinkPreResolver(tree);
    }

    has(tree: UrlTree) {
        return this.#trees.some((t) => t === tree);
    }

    remove(tree: UrlTree) {
        remove(this.#trees, (registeredTree) => registeredTree === tree);
    }

    registerRoutes(route: Route): void {
        const preResolveRoutes = getPreResolveRoutes(route);
        this.#preResolveRoutes.push(...preResolveRoutes);

        if (this.shouldPrefetch(route)) {
            const urls = new Map<string, (() => void)[]>();
            preResolveRoutes.forEach((route) => {
                const matches = this.#getMatches(route);
                matches.forEach(({ url, params }) => {
                    // The data passed to the preResolve fn is a basic mock of activated route
                    const preResolve = this.#getPreResolverFn(route, url, params);
                    if (urls.has(url)) {
                        urls.get(url)!.push(preResolve);
                    } else {
                        urls.set(url, [preResolve]);
                    }
                });
            });
            for (const [url, preResolvers] of urls) {
                if (!this.#routeToPreResolve.has(url)) {
                    this.#routeToPreResolve.set(url, preResolvers);
                }
                this.preResolve(url);
            }
        }
    }

    shouldPrefetch(route: Route) {
        if (this.#trees.length === 0) return false; // Do not check if in prefetch trees if is empty
        const { url, matcherRoutes } = findPathDetails(this.#router.config, route);
        const tree = this.#router.parseUrl(url);
        (<TreeWithRoutes>tree)['matchers'] = matcherRoutes;
        return this.#trees.some(containsTree.bind(null, tree));
    }

    preResolve(treeOrUrl: UrlTree | string) {
        const url = typeof treeOrUrl === 'string' ? treeOrUrl : this.#router.serializeUrl(treeOrUrl);
        if (this.#routeToPreResolve.has(url)) {
            const preResolvers = this.#routeToPreResolve.get(url) ?? [];
            preResolvers.forEach((preResolve) => {
                const exec = this.#preResolveExec.get(preResolve);
                if (!exec || new Date().getTime() - exec > this.#THROTTLE_TIME) {
                    this.#preResolveExec.set(preResolve, new Date().getTime());
                    this.#timerService.scheduleIdleCallback(() => {
                        runInInjectionContext(this.#injector, () => {
                            this.#ngZone.runOutsideAngular(() => {
                                preResolve();
                            });
                        });
                    });
                }
            });
        }
    }

    #getPreResolverFn(route: Route, url: string, params: Params): () => void {
        const paramsKey = JSON.stringify(params);
        if (!this.#preResolveParams.has(route)) {
            this.#preResolveParams.set(route, new Map());
        }
        if (!this.#preResolveParams.get(route)!.has(paramsKey)) {
            const fn = () => route.data!.preResolve({ data: route.data, preResolverUrl: url, params });
            this.#preResolveParams.get(route)!.set(paramsKey, fn);
        }
        return this.#preResolveParams.get(route)!.get(paramsKey)!;
    }

    #setLinkPreResolver(tree: UrlTree) {
        const preResolverUrl = this.#router.serializeUrl(tree);
        const preResolveFns: (() => void)[] = [];
        for (const route of this.#preResolveRoutes) {
            const preResolveRouteTree = this.#matcherService.getExtendedTree(route);
            const params = this.#matcherService.getMatches(preResolveRouteTree, tree);
            if (params) {
                preResolveFns.push(() => route.data!.preResolve({ data: route.data, preResolverUrl, params }));
            }
        }

        if (preResolveFns.length) {
            this.#routeToPreResolve.set(preResolverUrl, preResolveFns);
            this.preResolve(preResolverUrl);
        }
    }

    #getMatches(route: Route, trees = this.#trees): { url: string; params: Params }[] {
        const routeTree = this.#matcherService.getExtendedTree(route);

        return uniqBy(
            trees.map((registeredTree) => ({
                url: this.#router.serializeUrl(registeredTree),
                registeredTree: registeredTree,
            })),
            'url',
        )
            .map(({ url, registeredTree }) => {
                const params = this.#matcherService.getMatches(routeTree, registeredTree);
                if (params) {
                    return { url, params };
                }
                return null;
            })
            .filter((match): match is { url: string; params: Params } => match !== null);
    }
}

function containsQueryParams(container: Params, containee: Params): boolean {
    // TODO: This does not handle array params correctly.
    return Object.keys(containee).length <= Object.keys(container).length && Object.keys(containee).every((key) => containee[key] === container[key]);
}

function containsTree(containee: UrlTree, container: UrlTree): boolean {
    return (
        containsQueryParams(container.queryParams, containee.queryParams) &&
        containsSegmentGroup(container.root, containee.root, containee.root.segments, (<TreeWithRoutes>containee)['matchers'])
    );
}

type TreeWithRoutes = UrlTree & { matchers: Routes };

function containsSegmentGroup(
    container: UrlSegmentGroup,
    containee: UrlSegmentGroup,
    containeePaths: UrlSegment[],
    matchers: PathDetails['matcherRoutes'],
): boolean {
    if (container.segments.length > containeePaths.length) {
        const current = container.segments.slice(0, containeePaths.length);
        if (!equalPath(current, containeePaths, matchers)) return false;
        return !containee.hasChildren();
    } else if (container.segments.length === containeePaths.length) {
        if (!equalPath(container.segments, containeePaths, matchers)) return false;
        if (!containee.hasChildren()) return true;

        for (const c in containee.children) {
            if (!container.children[c]) break;
            if (containsSegmentGroup(container.children[c], containee.children[c]!, containee.children[c]!.segments, matchers)) return true;
        }
        return false;
    } else {
        const current = containeePaths.slice(0, container.segments.length);
        const next = containeePaths.slice(container.segments.length);
        if (!equalPath(container.segments, current, matchers)) return false;
        if (!container.children[PRIMARY_OUTLET]) return false;
        return containsSegmentGroup(container.children[PRIMARY_OUTLET], containee, next, matchers);
    }
}

function equalPath(as: UrlSegment[], bs: UrlSegment[], matchers: PathDetails['matcherRoutes']): boolean {
    if (as.length !== bs.length) return false;
    return as.every((a, i) => a.path === bs[i]!.path || a.path.startsWith(':') || bs[i]!.path.startsWith(':') || matchesMatcher(a, bs, i, matchers));
}

function matchesMatcher(a: UrlSegment, bs: UrlSegment[], i: number, matchers?: PathDetails['matcherRoutes']): boolean {
    if (matchers && matchers.length && matchers[0]!.matcher && bs[i]!.path === PATTERN_ALIAS) {
        // @TODO: This does not remove the matcher so it does not work properly if route contains multiple URL matchers
        return !!matchers[0]!.matcher([a], [] as any, matchers[0]!);
    }
    return false;
}
