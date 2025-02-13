import { undefinedToNull } from '../../utils/convert';
import { StorageBackend } from '../browser.models';

export class FallbackStorageBackend implements StorageBackend {
    private storage: { [key: string]: string } = {};

    set(key: string, value: string) {
        this.storage[key] = value;
    }

    get(key: string): string | null {
        return undefinedToNull(this.storage[key]);
    }

    delete(key: string) {
        delete this.storage[key];
    }

    keys(): string[] {
        return Object.keys(this.storage);
    }
}
