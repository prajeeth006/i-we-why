import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';

import { BehaviorSubject, Observable, first, firstValueFrom, map } from 'rxjs';

import { MediaQueryService } from '../browser/media-query.service';
import { WindowEvent } from '../browser/window/window-ref.service';
import { Logger } from '../logging/logger';
import { LazyAsset } from './lazy-assets.client-config';

/**
 * @whatItDoes Dynamically/lazily loads styles.
 *
 * @howToUse
 * ```
 * this.stylesService.load('http://cnd.com/style.css');
 * this.stylesService.load('custom'); // Alias set in StylesheetBootstrapAsset.Alias with StylesheetLazyLoadStrategy.Custom on the server.
 * ```
 *
 * @stable
 */
@Injectable({
    providedIn: 'root',
})
export class StylesService {
    private initialized: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    private stylesInDom: Map<string, Promise<HTMLLinkElement | null>> = new Map();
    private aliasMap: Map<string, string> = new Map();
    private styleMap: Map<string, LazyAsset> = new Map();
    private styleCssMap: Map<string, string> = new Map();

    get stylesInitialized(): Observable<void> {
        return this.initialized.pipe(
            first((ready) => ready),
            map(() => {}),
        );
    }

    private readonly _doc = inject(DOCUMENT);

    constructor(
        private mediaQueryService: MediaQueryService,
        private log: Logger,
    ) {}

    init(stylesheets: LazyAsset[]) {
        stylesheets.forEach((s) => {
            if (s.alias) {
                this.aliasMap.set(s.alias, s.url);
            }

            this.styleMap.set(s.url, s);
        });
        this.initialized.next(true);
    }

    async load(aliasOrPath: string): Promise<void> {
        const href = await this.resolve(aliasOrPath);
        await this.loadStyle(href);
    }

    async add(id: string, content: string) {
        return injectCssStyle(id, content, this._doc).catch((e: unknown) => {
            this.log.error(`Failed loading raw style ${id} with ${content}.`, e);

            return null;
        });
    }

    async addStyle(id: string, content: string) {
        if (this.styleCssMap.has(id)) return;
        this.styleCssMap.set(id, content);
        return await this.add(id, content);
    }

    removeStyle(id: string) {
        const element = this._doc.querySelectorAll(`style#${id}`)[0];
        element?.remove();
        const removed = this.styleCssMap.delete(id);
        this.log.info(`Removed dom style ${id}, item ${removed} element ${!!element}`);
    }

    async loadStyle(style: LazyAsset): Promise<HTMLLinkElement | null> {
        if (!this.stylesInDom.has(style.url)) {
            let media: string | undefined;
            if (style.media) {
                media = this.mediaQueryService.toMediaQuery(style.media) as string;
            }
            const promise = injectCss(style.url, this._doc, media).catch((e: unknown) => {
                this.log.error(`Failed lazy loading style ${style.url}.`, e);

                return null;
            });

            this.stylesInDom.set(style.url, promise);
        }

        return Promise.resolve(this.stylesInDom.get(style.url)!);
    }

    private async resolve(aliasOrPath: string): Promise<LazyAsset> {
        let url = aliasOrPath;

        await firstValueFrom(this.stylesInitialized);

        if (this.aliasMap.has(aliasOrPath)) {
            url = this.aliasMap.get(aliasOrPath)!;
        }

        if (this.styleMap.has(url)) {
            return Promise.resolve(this.styleMap.get(url)!);
        }

        throw new Error(`Alias or path ${aliasOrPath} is not known.`);
    }
}

function injectCssStyle(id: string, content: string, doc: Document): Promise<HTMLStyleElement> {
    const element = doc.createElement('style');
    element.id = id;
    element.innerHTML = content;
    const promise = new Promise<HTMLStyleElement>((resolve, reject) => {
        element.addEventListener(WindowEvent.Load, () => resolve(element));
        element.addEventListener(WindowEvent.Error, () => reject(element));
    });
    doc.body.appendChild(element);

    return promise;
}

function injectCss(href: string, doc: Document, media?: string): Promise<HTMLLinkElement> {
    const element = doc.createElement('link');
    element.rel = 'stylesheet';
    element.type = 'text/css';
    element.href = href;
    if (media) {
        element.media = media;
    }

    const promise = new Promise<HTMLLinkElement>((resolve, reject) => {
        element.addEventListener(WindowEvent.Load, () => resolve(element));
        element.addEventListener(WindowEvent.Error, () => reject(element));
    });

    doc.head.appendChild(element);

    return promise;
}
