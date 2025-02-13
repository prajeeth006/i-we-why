import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { Page } from '../client-config/page.client-config';

/**
 * @whatItDoes Utility for checking the matching state of @media queries.
 *
 * @description
 *
 *  A wrapper for [`BreakpointObserver`](https://material.angular.io/cdk/layout/api#BreakpointObserver).
 *
 * `breakpoints` returns breakpoints aliases from config.
 * `observe` Gets an observable of results for given queries or if queries are not passed and for breakpoint aliases from config.
 *
 * @howToUse
 * ```
 * this.mediaQueryService.observe();
 * this.mediaQueryService.observe('sm');
 * this.mediaQueryService.observe(['xs', 'sm']);
 * this.mediaQueryService.observe('screen and (max-width: 599px)');
 * this.mediaQueryService.observe(['(max-width: 599px)', '(min-width: 960px) and (max-width: 1279px)']);
 * this.mediaQueryService.isActive('sm');
 * this.mediaQueryService.isActive(['xs', 'sm']);
 * this.mediaQueryService.isActive('screen and (max-width: 599px)');
 * this.mediaQueryService.isActive(['(max-width: 599px)', '(min-width: 960px) and (max-width: 1279px)']);
 * this.mediaQueryService.toMediaQuery('sm');
 * this.mediaQueryService.toMediaQuery(['xs', 'sm']);
 * this.mediaQueryService.toMediaQuery(['xs', 'screen and (max-width: 599px)']);
 * ```
 *
 * @experimental
 */
@Injectable({
    providedIn: 'root',
})
export class MediaQueryService {
    constructor(
        private page: Page,
        private breakpointObserver: BreakpointObserver,
    ) {}

    private get registeredMediaQueries(): string[] {
        return this.page.breakpoints ? Object.values(this.page.breakpoints) : [];
    }

    /** Configured breakpoint aliases with their respective media queries. */
    get breakpoints(): { [p: string]: string } {
        return this.page.breakpoints;
    }

    /**
     * Gets an observable of results for the given queries/registered breakpoints that will emit new results for any changes
     * in matching of the given queries/registered breakpoints.
     * If `query` parameter is not passed, breakpoints registered in config will be used to check media query changes.
     * @param query One or more breakpoint aliases/media queries to check.
     * @returns A stream of matches for the given queries/registered breakpoints.
     */
    observe(query?: string | readonly string[]): Observable<BreakpointState> {
        const mediaQuery = query ? this.toMediaQuery(query) : this.registeredMediaQueries;

        return this.breakpointObserver.observe(mediaQuery);
    }

    /**
     * Whether one or more breakpoint aliases/media queries match the current viewport size.
     * @param query  One or more breakpoint aliases/media queries to check.
     * @returns Whether any of the media queries match.
     */
    isActive(query: string | readonly string[]): boolean {
        return this.breakpointObserver.isMatched(this.toMediaQuery(query));
    }

    /**
     * Map breakpoint aliases to a media queries.
     * @param query One or more breakpoint alises/media queries to map.
     * @returns One or array of media queries.
     */
    toMediaQuery(query: string | readonly string[]): string | string[] {
        if (Array.isArray(query)) {
            return query.map((value) => this.predicate(value as string));
        }

        return this.predicate(query as string);
    }

    private predicate: (value: string) => string = (value: string) => this.page.breakpoints[value] ?? value;
}
