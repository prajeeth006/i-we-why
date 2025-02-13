import { CookieService } from './cookie.service';

/**
 * @stable
 */
export class CookieList<T> {
    constructor(
        private cookieService: CookieService,
        private key: string,
        private expires?: Date,
    ) {}

    get(predicate: (item: T) => boolean): T[] {
        return this.read().filter(predicate);
    }

    getOne(predicate: (item: T) => boolean): T | undefined {
        return this.read().find(predicate);
    }

    insert(item: T) {
        const items = this.read();
        items.push(item);
        this.write(items);
    }

    update(predicate: (item: T) => boolean, action: (item: T) => void) {
        const items = this.read();
        items.filter(predicate).forEach((i) => action(i));
        this.write(items);
    }

    /** Delete all values that match the predicate. */
    delete(predicate: (item: T) => boolean) {
        let items = this.read();
        items = items.filter((i) => !predicate(i));
        this.write(items);
    }

    /** Delete just first value that match the predicate */
    deleteFirstMatch(predicate: (item: T) => boolean) {
        let items = this.read();
        let deleted = false;

        items = items.filter((i: T) => {
            if (!deleted && predicate(i)) {
                deleted = true;
                return false;
            }

            return true;
        });

        this.write(items);
    }

    getAll(): T[] {
        return this.read();
    }

    updateAll(action: (item: T) => void) {
        this.update(() => true, action);
    }

    deleteAll() {
        this.write([]);
    }

    private read(): T[] {
        return this.cookieService.getObject(this.key) || [];
    }

    private write(items: T[]) {
        this.cookieService.put(this.key, JSON.stringify(items), { expires: this.expires || '' });
    }
}
