import { StorageBackend } from '../browser.models';

export class BrowserStorageBackend implements StorageBackend {
    constructor(private storage: Storage) {}

    set(key: string, value: string) {
        this.storage.setItem(key, value);
    }

    get(key: string): string | null {
        return this.storage.getItem(key);
    }

    delete(key: string) {
        this.storage.removeItem(key);
    }

    keys(): string[] {
        return Object.keys(this.storage);
    }
}
