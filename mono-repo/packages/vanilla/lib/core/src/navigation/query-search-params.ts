import { HttpParameterCodec, HttpParams } from '@angular/common/http';

class NavigationQueryEncoder implements HttpParameterCodec {
    decodeKey(key: string): string {
        return decodeURIComponent(key);
    }

    decodeValue(value: string): string {
        return decodeURIComponent(value);
    }

    encodeKey(k: string): string {
        return this.encode(k);
    }

    encodeValue(v: string): string {
        return this.encode(v);
    }

    private encode(v: string) {
        return encodeURIComponent(v).replace(/%40/gi, '@').replace(/%3A/gi, ':').replace(/%24/g, '$').replace(/%2C/gi, ',');
    }
}

/**
 * @whatItDoes Provides query parameters in a case insensitive way, with navigation url encoding.
 *
 * @stable
 */
export class QuerySearchParams {
    private inner: HttpParams;
    private ciParams: Map<string, string[]> = new Map();

    constructor(rawParams: string) {
        this.inner = new HttpParams({
            encoder: new NavigationQueryEncoder(),
            fromString: rawParams,
        });

        this.buildCiMap();
    }

    has(param: string) {
        return this.ciParams.has(param.toLowerCase());
    }

    get(param: string) {
        const keys = this.ciParams.get(param.toLowerCase());
        if (keys) {
            return this.inner.get(keys[0]!);
        }

        return null;
    }

    getAll(param: string) {
        const keys = this.ciParams.get(param.toLowerCase());
        if (keys) {
            return keys.reduce<string[]>((a, k) => a.concat(this.inner.getAll(k)!), []);
        }

        return null;
    }

    set(param: string, val: string) {
        this.inner = this.inner.set(param, val);

        this.addCiKey(param);
    }

    delete(param: string) {
        const lowerCaseKey = param.toLowerCase();
        const keys = this.ciParams.get(lowerCaseKey);

        if (keys) {
            keys.forEach((k) => (this.inner = this.inner.delete(k)));
            this.ciParams.delete(lowerCaseKey);
        }
    }

    append(param: string, val: string) {
        this.inner = this.inner.append(param, val);

        this.addCiKey(param);
    }

    keys() {
        return this.inner.keys();
    }

    toString() {
        return this.inner.toString();
    }

    clone() {
        return new QuerySearchParams(this.toString());
    }

    private buildCiMap() {
        this.inner.keys().forEach((key) => this.addCiKey(key));
    }

    private addCiKey(key: string) {
        const lowerCaseKey = key.toLowerCase();
        const existing = this.ciParams.get(lowerCaseKey);
        let newValue;
        if (existing) {
            newValue = existing.concat(key);
        } else {
            newValue = [key];
        }

        this.ciParams.set(lowerCaseKey, newValue);
    }
}
