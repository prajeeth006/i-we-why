import { ImmutableSearchParams } from './immutable-search-params';
import { ParsedUrl } from './parsed-url';

/**
 * Immutable version of {@link ParsedUrl}.
 *
 * @stable
 */
export class ImmutableParsedUrl {
    get protocol(): string {
        return this.parsedUrl.protocol;
    }

    get search(): ImmutableSearchParams {
        return this.immutableSearchParams;
    }

    get hash(): string {
        return this.parsedUrl.hash;
    }

    get hostname(): string {
        return this.parsedUrl.hostname;
    }

    get port(): string {
        return this.parsedUrl.port;
    }

    get pathname(): string {
        return this.parsedUrl.pathname;
    }

    get isSameHost(): boolean {
        return this.parsedUrl.isSameHost;
    }

    get isSameTopDomain(): boolean {
        return this.parsedUrl.isSameTopDomain;
    }

    get culture(): string | null {
        return this.parsedUrl.culture;
    }

    private cachedAbsUrl: string;
    private cachedUrl: string;
    private cachedHost: string;
    private cachedBaseUrl: string;
    private readonly immutableSearchParams: ImmutableSearchParams;

    constructor(private parsedUrl: ParsedUrl) {
        this.immutableSearchParams = new ImmutableSearchParams(this.parsedUrl.search);
    }

    path() {
        return this.pathname;
    }

    url() {
        if (!this.cachedUrl) {
            this.cachedUrl = this.parsedUrl.url();
        }

        return this.cachedUrl;
    }

    baseUrl() {
        if (!this.cachedBaseUrl) {
            this.cachedBaseUrl = this.parsedUrl.baseUrl();
        }

        return this.cachedBaseUrl;
    }

    host() {
        if (!this.cachedHost) {
            this.cachedHost = this.parsedUrl.host();
        }

        return this.cachedHost;
    }

    absUrl() {
        if (!this.cachedAbsUrl) {
            this.cachedAbsUrl = this.parsedUrl.absUrl();
        }

        return this.cachedAbsUrl;
    }

    clone() {
        return this.parsedUrl.clone();
    }
}
