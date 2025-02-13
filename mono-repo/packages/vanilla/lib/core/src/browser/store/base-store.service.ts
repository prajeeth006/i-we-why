import { InjectionToken } from '@angular/core';

import { StorageBackend } from '../browser.models';
import { CustomWindow } from '../window/window-ref.service';
import { BrowserStorageBackend } from './browser-storage-backend';
import { FallbackStorageBackend } from './fallback-storage-backend';

/**
 * Prefix used by {@link SessionStoreService} and {@link LocalStoreService}.
 *
 * @stable
 */
export const STORE_PREFIX = new InjectionToken<string>('vn-store-prefix');

/**
 * Base service for browser storage services.
 *
 * @stable
 */
export abstract class BaseStoreService {
    protected constructor(
        private backend: StorageBackend,
        private prefix: string,
    ) {}

    get<T>(key: string): T | null {
        const item = this.backend.get(this.prefix + key);
        if (item) {
            return <T>JSON.parse(item);
        } else {
            return null;
        }
    }

    set<T>(key: string, value: T) {
        if (value == null) {
            this.backend.delete(this.prefix + key);
        } else {
            this.backend.set(this.prefix + key, JSON.stringify(value));
        }
    }

    keys(): string[] {
        return this.backend
            .keys()
            .filter((k) => k.startsWith(this.prefix))
            .map((k) => k.substring(this.prefix.length));
    }

    remove(key: string) {
        this.backend.delete(this.prefix + key);
    }
}

/** @internal */
export function getBackend(windowRef: CustomWindow, type: 'local' | 'session'): StorageBackend {
    const storage: Storage = windowRef[type + 'Storage'];

    try {
        storage.setItem('__test', 'data');
        storage.removeItem('__test');

        return new BrowserStorageBackend(storage);
    } catch (e) {
        // not supported, fallback
        return new FallbackStorageBackend();
    }
}
