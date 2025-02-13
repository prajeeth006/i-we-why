import { Injectable, Type } from '@angular/core';

/**
 * @stable
 */

export enum VanillaDynamicComponentsCategory {
    Header = 'HEADER',
    PageMatrix = 'PAGE-MATRIX',
    AccountMenu = 'ACCOUNT-MENU',
    NewVisitorPage = 'NEW-VISITOR-PAGE',
    Login = 'LOGIN',
}

interface LazyComponentData {
    lazyImportFn: () => Promise<Type<any>>;
    preloading: boolean;
    preload: Promise<Type<any> | null>;
}

/**
 * @stable
 */
@Injectable({
    providedIn: 'root',
})
export class DynamicComponentsRegistry {
    private componentRegistrations: Map<string, Map<string, Type<any>>> = new Map();
    private lazyComponentsMap: Map<string, Map<string, LazyComponentData>> = new Map();

    registerLazyComponent(category: string, name: string, lazyImportFn: () => Promise<Type<any>>) {
        let categoryMap = this.lazyComponentsMap.get(category);
        if (!categoryMap) {
            categoryMap = new Map<string, LazyComponentData>();
            this.lazyComponentsMap.set(category, categoryMap);
        }

        categoryMap.set(name, {
            lazyImportFn,
            preloading: false,
            preload: Promise.resolve(null),
        });
    }

    preloadLazyComponent(category: string, name: string) {
        const categoryMap = this.lazyComponentsMap.get(category);
        if (categoryMap) {
            const lazyCmpData = categoryMap.get(name);
            if (lazyCmpData) {
                categoryMap.set(name, {
                    ...lazyCmpData,
                    preloading: true,
                    preload: lazyCmpData.lazyImportFn(),
                });
            }
        }
    }

    getLazyComponent(category: string, name: string): Promise<Type<any> | null> {
        const categoryMap = this.lazyComponentsMap.get(category);
        if (categoryMap) {
            const lazyCmpData = categoryMap.get(name);
            if (lazyCmpData) {
                const { lazyImportFn, preload, preloading } = lazyCmpData;
                return preloading ? preload : lazyImportFn();
            }
        }
        return Promise.resolve(null);
    }

    registerComponent(category: string, name: string, componentType: Type<any>) {
        let categoryMap = this.componentRegistrations.get(category);
        if (!categoryMap) {
            categoryMap = new Map();
            this.componentRegistrations.set(category, categoryMap);
        }

        categoryMap.set(name, componentType);
    }

    get(category: string, name: string): Type<any> | null {
        const categoryMap = this.componentRegistrations.get(category);
        if (categoryMap) {
            return categoryMap.get(name) || null;
        }

        return null;
    }
}
