import { DOCUMENT } from '@angular/common';
import { Injectable, NgZone, inject } from '@angular/core';

import { WINDOW, WindowEvent } from '@frontend/vanilla/core';
import { fromEvent, take } from 'rxjs';

import { DataLayerProxyService } from './data-layer-proxy.service';
import { PartytownService } from './partytown.service';
import { TrackingConfig } from './tracking.client-config';
import { ClientTagManager } from './tracking.models';

/**
 * @whatItDoes Injects all configured client-side tag manager scripts into the DOM.
 *
 * @description
 *
 * Client-side tag managers can be configured using TrackingConfig.
 *
 * @stable
 */
@Injectable({
    providedIn: 'root',
})
export class TagManagerService {
    private readonly _doc = inject(DOCUMENT);
    readonly #window = inject(WINDOW);
    private partytownService = inject(PartytownService);

    /**
     * @internal
     */
    constructor(
        private trackingConfig: TrackingConfig,
        private dataLayerProxy: DataLayerProxyService,
        private ngZone: NgZone,
    ) {}

    /** @internal */
    init() {
        if (!this.trackingConfig.isEnabled) {
            return;
        }

        const configured = this.trackingConfig.clientTagManagers || [];
        const excludes = this.trackingConfig.clientInjectionExcludes || [];

        configured.filter((current) => !excludes.includes(current.name)).forEach((current) => this.injectScript(current));
    }

    /** @stable */
    get availableClientTagManagers(): string[] {
        return (this.trackingConfig.clientTagManagers || []).map((t: ClientTagManager) => t.name);
    }

    /** Adds a tag manager init script for the given tag managerer renderer name to the script unless present.
     *
     * @stable
     */
    async load(rendererName: string, type?: string): Promise<Element> {
        const configured = this.trackingConfig.clientTagManagers || [];
        const tagManager = configured.find((current) => current.name === rendererName);

        if (!tagManager) {
            throw new Error(`Client TagManager "${rendererName}" does not exist.`);
        }

        const existing = this._doc.querySelector('#' + tagManager.name);

        if (existing) {
            return existing;
        }

        const forceSchedulerDisabled = type === 'text/partytown';

        await this.dataLayerProxy.patchDataLayer(forceSchedulerDisabled);
        return this.injectScript(tagManager, type);
    }

    private injectScript(tagManager: ClientTagManager, type = 'text/javascript'): Promise<HTMLScriptElement> {
        const id = tagManager.name;
        const script = this._doc.createElement('script');
        script.async = true;
        script.id = id;
        script.text = tagManager.script;
        script.type = type;

        const promise = new Promise<HTMLScriptElement>((resolve, reject) => {
            script.onload = () => resolve(script);
            script.onerror = () => reject(new Error(`Client TagManager "${id}" failed to load.`));
        });

        this._doc.body.append(script);

        return promise;
    }

    public loadPartyTownGTM() {
        const isDisabledLocally = localStorage.getItem('partytown-disabled') === '1';
        const isServiceWorkerSupported = 'serviceWorker' in navigator;
        if (isServiceWorkerSupported && !isDisabledLocally && this.#window.partytown && this.#window._ptReady) {
            this.#window._ptReady
                .then(() => {
                    this.#window.dataLayer = this.#window.dataLayer ?? [];

                    this.partytownService.createSharedStorage();

                    this.ngZone.runOutsideAngular(() => {
                        fromEvent(this._doc, 'gtm_loaded')
                            .pipe(take(1))
                            .subscribe(() => {
                                // tell tracking system gtm was loaded
                                this.push({ event: WindowEvent.VanillaGtmLoaded });
                                this.push({ event: WindowEvent.GtmLoad });
                                if (this.#window.partytown.enableEventReplay) {
                                    setTimeout(() => {
                                        this.partytownService.createEventReplayQueue();
                                    }, 5000);
                                }
                            });

                        this.load('GoogleTagManagerRenderer', 'text/partytown');

                        if (document.readyState === 'complete') {
                            // we need to do that async, as the script injection also is async
                            setTimeout(() => this.#window.dispatchEvent(new CustomEvent('ptupdate')));
                        } else {
                            this.#window.addEventListener('load', () => {
                                setTimeout(() => {
                                    // notify partytown that we've added a new script
                                    this.#window.dispatchEvent(new CustomEvent('ptupdate'));
                                });
                            });
                        }
                    });
                })
                .catch(() => {
                    this.load('GoogleTagManagerRenderer');
                });
        } else {
            this.load('GoogleTagManagerRenderer');
        }
    }

    private push(payload: object) {
        if (this.#window.dataLayer) {
            const dataLayer = this.#window.dataLayer;
            // workaround to don't trigger dataLayer.push
            // since it is patched by partytown and unnecessarily propagates data to the worker
            dataLayer[dataLayer.length] = payload;
        }
    }
}
