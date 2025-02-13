import { isAbsolute } from '../utils/url';
import { AppendReferrerOptions } from './navigation.models';
import { QuerySearchParams } from './query-search-params';
import { UrlService } from './url.service';

/**
 * @whatItDoes Holds url parts parsed by @{link UrlService}.
 *
 * See http://url.spec.whatwg.org/#urlutils for reference.
 *
 * @stable
 */
export class ParsedUrl {
    constructor(
        private urlService: UrlService,
        public protocol: string,
        public search: QuerySearchParams,
        public hash: string,
        public hostname: string,
        public port: string,
        public pathname: string,
        /**
         * Whether the original url was relative.
         */
        public isRelative: boolean,
        /**
         * Whether parse url is on the same host as current url.
         */
        public isSameHost: boolean,
        /**
         * Whether parse url has the same domain as `page.domain`
         */
        public isSameTopDomain: boolean,
        public culture: string | null,
    ) {}

    clone(): ParsedUrl {
        return new ParsedUrl(
            this.urlService,
            this.protocol,
            this.search.clone(),
            this.hash,
            this.hostname,
            this.port,
            this.pathname,
            this.isRelative,
            this.isSameHost,
            this.isSameTopDomain,
            this.culture,
        );
    }

    /**
     * Creates a relative url representation of the parsed url parts, e.g. `/en/casino/play/blackjack?mode=real#frag`.
     */
    url(): string {
        let url = this.pathname;

        const queryString = this.search.toString();
        if (queryString) {
            url += '?' + queryString;
        }

        if (this.hash) {
            url += '#' + encodeURI(this.hash);
        }

        return url;
    }

    /**
     * Returns the path. e.g. `/en/casino/play/blackjack` (alias for `pathname`).
     */
    path(): string {
        return this.pathname;
    }

    /**
     * Creates an base url representation of the parsed url parts. e.g. `http://dev.www.bwin.com:1337`.
     */
    baseUrl(): string {
        return `${this.protocol}://${this.host()}`;
    }

    /**
     * Returns the host (hostname + port). e.g. `dev.www.bwin.com:1337`.
     */
    host(): string {
        let host = this.hostname;

        // NOTE: PhantomJS returns port '0'
        if (this.port && this.port !== '0') {
            host += ':' + this.port;
        }

        return host;
    }

    /**
     * Creates an absolute url representation of the parsed url parts. e.g. `http://dev.www.bwin.com:1337/en/casino/play/blackjack?mode=real#frag`.
     */
    absUrl(): string {
        return this.baseUrl() + this.url();
    }

    /**
     * Properly replaces all references to the language part of the url to a different language.
     */
    changeCulture(culture: string) {
        culture = culture.toLowerCase();

        if (this.urlService.supportedLanguages.indexOf(culture) < 0) {
            throw new Error('"' + culture + '" is not in the list of supported cultures.');
        }

        if (!this.pathname || this.pathname === '/') {
            this.pathname = '/' + culture;
            this.culture = culture;
        } else if (this.culture !== null) {
            const cultureRegex = new RegExp(this.urlService.culturePattern, 'gi');
            this.pathname = this.pathname.replace(cultureRegex, '/' + culture + '/');

            this.culture = culture;

            // remove trailing slash
            this.pathname = this.pathname.replace(/\/$/gi, '');
        }
    }

    /**
     * Appends `rurl` query string parameter to the url.
     *
     * If `isRelative` is false and the `rurl` is not absolute then it is converted to absolute.
     *
     * The `rurl` is picked based on this priority:
     * 1. `url` from {@link AppendReferrerOptions options}
     * 2. current `rurl`
     * 3. current url
     */
    appendReferrer(options?: AppendReferrerOptions) {
        options = options || {};

        const currentUrl = this.urlService.current();

        let returnUrl = options.url || currentUrl.search.get('rurl') || (options.absolute ? currentUrl.absUrl() : currentUrl.url());

        if (!this.isRelative && !isAbsolute(returnUrl)) {
            // target link is absolute but rurl is not -> change rurl to absolute
            returnUrl = this.urlService.parse(returnUrl).absUrl();
        }

        this.search.set('rurl', returnUrl);
    }
}
