import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';

import { WINDOW } from '../browser/window/window.token';
import { LanguageInfo, Page } from '../client-config/page.client-config';
import { isAbsolute } from '../utils/url';
import { AppendReferrerOptions, NavigationUrl } from './navigation.models';
import { ParsedUrl } from './parsed-url';
import { QuerySearchParams } from './query-search-params';

/**
 * @whatItDoes Parses url into parts, then puts it back together (parts can be modified).
 *
 * @howToUse
 *
 * ```
 * var someUrl = 'http://www.google.com/search?a=1';
 * var url = urlService.parse(someUrl);
 *
 * url.set('param', 'hello');
 *
 * url.url() // returns '/search?a=1&param=hello'
 * url.absUrl() // http://www.google.com/search?a=1&param=hello
 * ```
 *
 * ```
 * var someUrl = '/search?a=1';
 * var url = urlService.parse(someUrl);
 *
 * url.set('param', 'hello');
 *
 * url.url() // returns '/search?a=1&param=hello'
 * url.absUrl() // http://www.google.com/search?a=1&param=hello
 * ```
 *
 * @description
 *
 * A helper service used for parsing urls, and making complex changes to them. Url is parsed using virtual `a` DOM node.
 *
 * See {@link ParsedUrl}
 *
 * @stable
 */
@Injectable({
    providedIn: 'root',
})
export class UrlService {
    readonly #window = inject(WINDOW);
    /**
     * @internal
     */
    readonly supportedLanguages: string[];

    /**
     * @internal
     */
    readonly culturePattern: string;

    private readonly _doc = inject(DOCUMENT);

    private parsingNode: HTMLAnchorElement = this._doc.createElement('a');

    constructor(private page: Page) {
        this.supportedLanguages = this.page.uiLanguages.concat(this.page.hiddenLanguages).map((l: LanguageInfo) => l.routeValue);
        this.culturePattern = '^/?(' + this.supportedLanguages.join('|') + ')(/|\\?|$)';
    }

    /**
     * Parses specified url and returns {@link ParsedUrl} instance.
     */
    parse(url: string): ParsedUrl {
        const interpretedUrl = this.interpretUrl(url);
        let href = interpretedUrl.href;

        if ((<any>this._doc).documentMode) {
            this.parsingNode.setAttribute('href', href);

            href = this.parsingNode.href;
        }

        this.parsingNode.setAttribute('href', href);

        const searchParams = new QuerySearchParams(this.parsingNode.search ? this.parsingNode.search.replace(/^\?/, '') : '');
        const protocol = this.parsingNode.protocol ? this.parsingNode.protocol.replace(/:$/, '') : '';
        const hash = this.parsingNode.hash ? this.parsingNode.hash.replace(/^#/, '') : '';
        const hostname = this.parsingNode.hostname;
        const port = this.parsingNode.port;
        const pathname =
            this.parsingNode.pathname.charAt(0) === '/' && this.parsingNode.pathname.charAt(1) !== '/'
                ? this.parsingNode.pathname
                : '/' + this.parsingNode.pathname;
        // bwin custom
        const isSameHost = this.#window.location.href.indexOf(this.parsingNode.protocol + '//' + this.parsingNode.host) === 0;
        const isSameTopDomain = this.parsingNode.hostname.endsWith(this.page.domain);
        const isRelative = interpretedUrl.isRelative;
        const culture = this.getCulture(pathname);

        return new ParsedUrl(this, protocol, searchParams, hash, hostname, port, pathname, isRelative, isSameHost, isSameTopDomain, culture);
    }

    /**
     * Parses current browser url and returns {@link ParsedUrl} instance.
     */
    current(): ParsedUrl {
        return this.parse(this.#window.location.href);
    }

    /**
     * Returns true if specified url is absolute. Otherwise, returns false.
     */
    isAbsolute(url: string): boolean {
        return isAbsolute(url);
    }

    /**
     * Adds a `rurl` query string parameter to the url. See {@link ParsedUrl#appendReferrer ParsedUrl.appendReferrer()}.
     */
    appendReferrer(url: string, options?: AppendReferrerOptions): string {
        const resultUrl = this.parse(url);

        resultUrl.appendReferrer(options);

        return resultUrl.absUrl();
    }

    private getCulture(path: string): string | null {
        // if there is no language in the current location it means the default language is active
        if (path === '' || path === '/') {
            return this.page.defaultLanguage.routeValue;
        }

        const cultureRegex = new RegExp(this.culturePattern, 'gi');

        const culture = cultureRegex.exec(path);

        // problem getting the language code
        if (culture == null) {
            return null;
        }

        // return languageCode from pathname
        return culture[1] || null;
    }

    private interpretUrl(url: string): NavigationUrl {
        url = this.replaceUrlPlaceholders(url);

        if (this.isAbsolute(url)) {
            return { href: url, isRelative: false };
        }

        if (url === '/') {
            return { href: '/' + this.page.lang, isRelative: true };
        }

        if (url.charAt(0) === '/') {
            const cultureRegex = new RegExp(this.culturePattern, 'gi');
            if (cultureRegex.test(url)) {
                // url already begins at root and includes language prefix
                return { href: url, isRelative: true };
            }

            return { href: '/' + this.page.lang + url, isRelative: true };
        }

        if (url.charAt(0) === '?') {
            return { href: this.#window.location.pathname + url, isRelative: true };
        }

        return { href: this.#window.location.pathname + '/' + url, isRelative: true };
    }

    private replaceUrlPlaceholders(url: string): string {
        return url?.replace(/{culture}/g, this.page.lang) || url;
    }
}
