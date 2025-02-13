import { QuerySearchParams } from './query-search-params';

/**
 * Immutable version of URLSearchParams.
 *
 * @stable
 */
export class ImmutableSearchParams {
    constructor(private searchParams: QuerySearchParams) {}

    clone(): QuerySearchParams {
        return new QuerySearchParams(this.searchParams.toString());
    }

    has(param: string): boolean {
        return this.searchParams.has(param);
    }

    get(param: string): string | null {
        return this.searchParams.get(param);
    }

    getAll(param: string): string[] | null {
        return this.searchParams.getAll(param);
    }

    keys() {
        return this.searchParams.keys();
    }

    toString(): string {
        return this.searchParams.toString();
    }
}
