import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';

import { BehaviorSubject, Observable, first, firstValueFrom, map } from 'rxjs';

import { Logger } from '../logging/logger';
import { LazyAsset } from './lazy-assets.client-config';

/**
 * @whatItDoes Dynamically/lazily loads scripts.
 *
 * @howToUse
 * ```
 * this.scriptsService.load('http://localhost:9999/ClientDist/themes/black/native-app.js');
 * this.scriptsService.load('custom'); // Alias set in ScriptBootstrapAsset.Alias with AssetLazyLoadStrategy.Custom on the server.
 * ```
 *
 * @stable
 */
@Injectable({
    providedIn: 'root',
})
export class ScriptsService {
    private initialized: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    private scriptsLoaded: Map<string, Promise<HTMLScriptElement | null>> = new Map();
    private aliasMap: Map<string, string> = new Map();
    private scriptsMap: Map<string, LazyAsset> = new Map();

    get scriptsInitialized(): Observable<void> {
        return this.initialized.pipe(
            first((ready) => ready),
            map(() => {}),
        );
    }

    private readonly _doc = inject(DOCUMENT);

    constructor(private log: Logger) {}

    init(scripts: LazyAsset[]) {
        scripts.forEach((s) => {
            if (s.alias) {
                this.aliasMap.set(s.alias, s.url);
            }

            this.scriptsMap.set(s.url, s);
        });
        this.initialized.next(true);
    }

    async load(aliasOrPath: string): Promise<void> {
        const href = await this.resolve(aliasOrPath);

        await this.loadScript(href);
    }

    private async loadScript(script: LazyAsset): Promise<HTMLScriptElement | null> {
        if (!this.scriptsLoaded.has(script.url)) {
            const promise = injectScript(script.url, this._doc).catch((e: unknown) => {
                this.log.error(`Failed lazy loading script ${script.url}.`, e);

                return null;
            });

            this.scriptsLoaded.set(script.url, promise);
        }

        return Promise.resolve(this.scriptsLoaded.get(script.url)!);
    }

    private async resolve(aliasOrPath: string): Promise<LazyAsset> {
        let url = aliasOrPath;

        await firstValueFrom(this.scriptsInitialized);

        if (this.aliasMap.has(aliasOrPath)) {
            url = this.aliasMap.get(aliasOrPath)!;
        }

        if (this.scriptsMap.has(url)) {
            return Promise.resolve(this.scriptsMap.get(url)!);
        }

        throw new Error(`Alias or path ${aliasOrPath} is not known.`);
    }
}

function injectScript(url: string, doc: Document): Promise<HTMLScriptElement> {
    const script = doc.createElement('script');
    script.src = url;
    script.async = true;
    script.defer = true;

    const promise = new Promise<HTMLScriptElement>((resolve, reject) => {
        script.onload = () => resolve(script);
        script.onerror = () => reject(script);
    });

    doc.head.appendChild(script);

    return promise;
}
