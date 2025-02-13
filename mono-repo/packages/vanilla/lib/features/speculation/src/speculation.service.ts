import { DOCUMENT } from '@angular/common';
import { Injectable, NgZone, Renderer2, RendererFactory2, inject } from '@angular/core';

import { Logger, Page, UrlService, UserEvent, UserLogoutEvent, UserPreHooksLoginEvent, UserService, WINDOW } from '@frontend/vanilla/core';
import { filter } from 'rxjs';

type SpeculationRules = Record<string, any>;

export const SPECULATION_LOG_TAG = '[Speculation]';
const SPECULATION_RULES_SCRIPT_ID = 'specrules';
const SPECULATION_RULES_SCRIPT_TYPE = 'speculationrules';

/**
 * Wraps around the Speculation Rules API.
 *
 * Requires an experimental HTTP header - Supports-Loading-Mode: credentialed-prerender
 *
 * This is a basic implementation and if extended in future should include the ability to register multiple
 * speculation rules scripts such that rules can be individually added/removed without evicting the whole cache.
 * Additionally, logic should also be added to batch and rate-limit adding/refreshing speculation rules (since they may trigger expensive operations).
 * It's worth mentiong that adding a rule that already exists won't cause another speculative load, but will add another script element to the DOM.
 */
@Injectable({
    providedIn: 'root',
})
export class SpeculationService {
    private page = inject(Page);
    private zone = inject(NgZone);
    private logger = inject(Logger);
    private document = inject(DOCUMENT);
    private urlService = inject(UrlService);
    private rendererFactory = inject(RendererFactory2);
    private userService = inject(UserService);
    private currentSpeculationRules: SpeculationRules;
    private renderer: Renderer2;

    readonly #window = inject(WINDOW);

    constructor() {
        this.renderer = this.rendererFactory.createRenderer(null, null);
    }

    _bootstrap() {
        this.logger.info(`${SPECULATION_LOG_TAG} Bootstrapping the speculation service...`);

        this.userService.events
            .pipe(filter((e) => e instanceof UserPreHooksLoginEvent || e instanceof UserLogoutEvent))
            .subscribe((e) => this.refreshCache(e));
    }

    /**
     * Use the Speculation Rules API to fully prerender (including JS and all subresources) the given URLs.
     * Use this to prerender slow same-site navigations (e.g. sports -> casino). Same-origin URLs are
     * (currently) assumed to be SPA navigations and are therefore ignored.
     */
    prerender(urls: string[]): void {
        // Exclude same-origin navigations. These are currently assumed to be SPA navigations, which
        // are never fetched and therefore never trigger usage of the prerendered page (it just gets wasted).
        const crossOriginUrls = urls.filter((url) => this.isCrossOriginUrl(url));

        if (!crossOriginUrls.length) {
            return;
        }

        this.addSpeculationRules({
            prerender: [
                {
                    source: 'list', //Backwards compatibility as it was made optional from chrome 122 but required before that.
                    urls: crossOriginUrls,
                },
            ],
        });
    }

    /**
     * Evicts the prerender cache and re-runs the current rules. This is VERY expensive but necessary (for now, MVP) when the cache has become
     * stale (e.g. by login/logout). In future, consider server updates to the connected prerendered pages (they are still live pages) or the
     * postMessage API to tell the background (non-activated) prerendered pages to update themselves. This should be done before the pages are
     * activated to prevent visible layout changes. We cannot use the Broadcast Channel API because it is same-origin only.
     *
     * Note that the cache is naturally refreshed by Chrome when it reaches 5 minutes old.
     */
    private refreshCache(event: UserEvent): void {
        if (!this.currentSpeculationRules) {
            return;
        }

        this.removeExistingSpeculationRules();

        // In most cases, logout triggers a reload. Deferring prevents prerendering when a reload is scheduled.
        const delay = event instanceof UserLogoutEvent ? 1000 : 0;

        // The script must be readded asynchronously to retrigger speculations
        this.zone.runOutsideAngular(() => {
            this.#window.setTimeout(() => {
                this.logger.info(`${SPECULATION_LOG_TAG} Refreshing speculations...`);

                this.addSpeculationRules(this.currentSpeculationRules);
            }, delay);
        });
    }

    /** Do not prerender URLs for this origin or internally aliased origins (e.g. dev.sports.com should not prerender sports.com) */
    private isCrossOriginUrl(url: string): boolean {
        const exists = Boolean(url);

        if (!exists) {
            return false;
        }

        const currentUrl = this.urlService.current();
        const prerenderUrl = this.urlService.parse(url);
        const isCrossOrigin = !prerenderUrl.isSameHost;
        const isAliasOrigin = (!this.page.isProduction || this.page.isInternal) && currentUrl.hostname.includes(prerenderUrl.hostname);

        return isCrossOrigin && !isAliasOrigin;
    }

    private addSpeculationRules(speculationRules: SpeculationRules): void {
        const script = this.createSpeculationRulesScript(speculationRules);

        this.addSpeculationRulesToDom(script);

        this.currentSpeculationRules = speculationRules;
    }

    private createSpeculationRulesScript(speculationRules: SpeculationRules): HTMLScriptElement {
        const speculationRulesScript: HTMLScriptElement = this.renderer.createElement('script');
        speculationRulesScript.textContent = JSON.stringify(speculationRules);
        speculationRulesScript.type = SPECULATION_RULES_SCRIPT_TYPE;
        speculationRulesScript.id = SPECULATION_RULES_SCRIPT_ID;

        return speculationRulesScript;
    }

    private addSpeculationRulesToDom(script: HTMLScriptElement): void {
        this.logger.info(`${SPECULATION_LOG_TAG} Adding speculation rules: ${script.textContent}`);

        this.renderer.appendChild(this.document.body, script);
    }

    private removeExistingSpeculationRules(): void {
        const existingSpeculationRules = this.document.getElementById(SPECULATION_RULES_SCRIPT_ID);

        if (existingSpeculationRules) {
            this.logger.info(`${SPECULATION_LOG_TAG} Removing speculation rules`);

            this.renderer.removeChild(this.document.body, existingSpeculationRules);
        }
    }
}
