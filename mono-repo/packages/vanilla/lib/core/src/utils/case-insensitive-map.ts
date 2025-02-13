/**
 * @whatItDoes Same as `Map<string, T>`, but with all keys converted to lowercase.
 *
 * @stable
 */
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class CaseInsensitiveMap<V> implements Map<string, V> {
    [Symbol.toStringTag]: 'Map';

    private inner: Map<string, V> = new Map();

    get(key: string): V | undefined {
        return this.inner.get(convertKey(key));
    }

    set(key: string, value: V): this {
        this.inner.set(convertKey(key), value);
        return this;
    }

    delete(key: string): boolean {
        return this.inner.delete(convertKey(key));
    }

    has(key: string): boolean {
        return this.inner.has(convertKey(key));
    }

    clear(): void {
        this.inner.clear();
    }

    get size(): number {
        return this.inner.size;
    }

    forEach(callbackfn: (value: V, key: string, map: Map<string, V>) => void, thisArg?: any): void {
        this.inner.forEach((v, k) => callbackfn.call(thisArg, v, k, this));
    }

    [Symbol.iterator](): IterableIterator<[string, V]> {
        return this.inner.entries();
    }

    entries(): IterableIterator<[string, V]> {
        return this.inner.entries();
    }

    keys(): IterableIterator<string> {
        return this.inner.keys();
    }

    values(): IterableIterator<V> {
        return this.inner.values();
    }
}

// eslint-disable-next-line no-redeclare
export interface CaseInsensitiveMap<V> {
    // eslint-disable-next-line @typescript-eslint/no-misused-new
    new (): CaseInsensitiveMap<V>;
}

function convertKey(key: string) {
    return key ? key.toLowerCase() : key;
}
