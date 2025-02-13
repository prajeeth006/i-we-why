import { Injectable } from '@angular/core';

import { CaseInsensitiveMap, Logger, NavigationService, PageService, RevertiblePageChange } from '@frontend/vanilla/core';
import { transform } from 'lodash-es';

import { MetaTagsConfig, PageMetaTagsRule, TagCollection } from './meta-tags.client-config';

const TITLE_CHANGE_KEY = '_vanilla:pageTitle_';

/**
 * @whatItDoes Manipulates page metadata (like title and meta tags).
 *
 * @howToUse
 *
 * ```
 * ngOnInit() {
 *     this.metaTagsService.setPageTags('Page Title', {
 *         description: 'This is awesome page.',
 *         author: 'Chuck Norris'
 *     }
 * }
 * ```
 *
 * @description
 *
 * You can use this service to change (or add) title and meta tags. All changes will survive only for particular page (until next navigation).
 * Values are automatically merged with configured ones by SEO analysts which take precedence.
 *
 * Values are automatically set for public pages displayed via {@link PageMatrixComponent}.
 *
 * @stable
 */
@Injectable({
    providedIn: 'root',
})
export class MetaTagsService {
    private pageMetaTags: PageMetaTagsRule[];
    private globalMetaTags: GlobalMetaTagsRule[];
    private globalChanges: Map<string, RevertiblePageChange> = new CaseInsensitiveMap();
    private customChanges: Map<string, RevertiblePageChange> = new CaseInsensitiveMap();

    constructor(
        private pageService: PageService,
        private config: MetaTagsConfig,
        private navigationService: NavigationService,
        private log: Logger,
    ) {}

    /**
     * @internal
     */
    initialize(): void {
        // prepare tags - create regexes, normalize urls
        this.pageMetaTags = this.config.pageMetaTags.map<PageMetaTagsRule>((r) => ({
            urlPath: normalizeUrlValue(r.urlPath),
            urlQueryParams: transform(
                r.urlQueryParams,
                (obj: Record<string, string>, val, name) => (obj[normalizeUrlValue(name)] = normalizeUrlValue(val)),
                {},
            ),
            title: r.title,
            tags: r.tags,
        }));
        this.globalMetaTags = this.config.globalMetaTags.map<GlobalMetaTagsRule>((r) => ({
            tags: r.tags,
            urlPathAndQueryRegexes: r.urlPathAndQueryRegexes.map((x) => {
                try {
                    return new RegExp(x, 'i');
                } catch (e) {
                    this.log.errorRemote(
                        `Failed to compile regex /${x}/ because it's not supported on this browser. So it won't be executed for SEO global meta tag rule "${r.ruleName}".`,
                        e,
                    );
                    return new RegExp('.^');
                }
            }),
        }));

        // register evaluation
        this.navigationService.locationChange.subscribe(() => this.evaluateSeoTags());
        this.evaluateSeoTags();
    }

    /**
     * Sets title and meta tags for current page (until next navigation).
     */
    setPageTags(title?: string, tags?: { [name: string]: string }): void {
        this.applyTitle(title, this.customChanges);
        this.applyTags(tags || {}, this.customChanges);
    }

    /**
     * Clears values previously set by `setMetaTags`. This is usually done automatically on location change, but
     */
    clearPageTags() {
        this.clearCustomChanges();
    }

    private evaluateSeoTags(): void {
        // revert changes from previous page
        this.clearCustomChanges();
        this.clearGlobalChanges();

        // find rule matching current page
        const path = normalizeUrlValue(this.navigationService.location.path());
        const query = this.navigationService.location.search;
        const qs = query.toString();
        const pathAndQuery = decodeURI(path + (qs ? '?' + qs : ''));

        const pageRule = this.pageMetaTags.find(
            (r) =>
                r.urlPath === path &&
                Object.keys(r.urlQueryParams).every((name) => {
                    const val = query.get(name);
                    return val !== null && normalizeUrlValue(val) === r.urlQueryParams[name];
                }),
        );

        // apply page rule
        if (pageRule) {
            this.applyTitle(pageRule.title, this.globalChanges);
            this.applyTags(pageRule.tags, this.globalChanges);
        }

        // apply global rules
        for (const globalRule of this.globalMetaTags) {
            if (globalRule.urlPathAndQueryRegexes.some((r) => r.test(pathAndQuery))) {
                this.applyTags(globalRule.tags, this.globalChanges);
            }
        }
    }

    private clearCustomChanges() {
        this.customChanges.forEach((c) => c.revert());
        this.customChanges.clear();
    }

    private clearGlobalChanges() {
        this.globalChanges.forEach((c) => c.revert());
        this.globalChanges.clear();
    }

    private applyTitle(title: string | null | undefined, changes: Map<string, RevertiblePageChange>) {
        if (typeof title === 'string' && !this.changeExists(TITLE_CHANGE_KEY)) {
            const change = this.pageService.setTitle(title);
            changes.set(TITLE_CHANGE_KEY, change);
        }
    }

    private applyTags(tags: TagCollection, changes: Map<string, RevertiblePageChange>): void {
        for (const name of Object.keys(tags)) {
            if (!name.trim().length) {
                throw new Error(`Tag name cannot be null nor white-space but such one was specified with value "${tags[name]}".`);
            }
            if (!this.changeExists(name)) {
                const change = this.pageService.setMeta(name, tags[name]!);
                changes.set(name, change);
            }
        }
    }

    private changeExists(name: string) {
        return this.globalChanges.has(name) || this.customChanges.has(name);
    }
}

function normalizeUrlValue(str: string): string {
    return str ? str.toLowerCase() : str;
}

interface GlobalMetaTagsRule {
    tags: TagCollection;
    urlPathAndQueryRegexes: RegExp[]; // config diff: regexes instead of strings
}
