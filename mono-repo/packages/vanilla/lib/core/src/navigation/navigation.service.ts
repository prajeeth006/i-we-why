import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, NavigationEnd, Router, RoutesRecognized } from '@angular/router';

import { BehaviorSubject, Observable, Subject, firstValueFrom } from 'rxjs';
import { filter } from 'rxjs/operators';

import { CookieName } from '../browser/cookie/cookie.models';
import { CookieService } from '../browser/cookie/cookie.service';
import { TimerService } from '../browser/timer.service';
import { WINDOW } from '../browser/window/window.token';
import { Page } from '../client-config/page.client-config';
import { LastKnownProductService } from '../last-known-product/last-known-product.service';
import { HeaderService } from '../lazy/service-providers/header.service';
import { LoadingIndicatorService } from '../loading-indicator/loading-indicator.service';
import { LoginStoreService } from '../login/login-store.service';
import { PostLoginService } from '../login/post-login.service';
import { MessageQueueService } from '../messages/message-queue.service';
import { NativeAppConfig } from '../native-app/native-app.client-config';
import { NativeAppService } from '../native-app/native-app.service';
import { RouteDataOptions } from '../routing/route-data';
import { UserService } from '../user/user.service';
import { ImmutableParsedUrl } from './immutable-parsed-url';
import { GoToLastKnownProductOptions, GoToOptions, LocationChangeEvent, NativeAppGoToOptions } from './navigation.models';
import { ParsedUrl } from './parsed-url';
import { UrlService } from './url.service';

/**
 * @whatItDoes Provides utility functions for navigation.
 *
 * @stable
 */
@Injectable({
    providedIn: 'root',
})
export class NavigationService {
    readonly #window = inject(WINDOW);

    private previousLocation: string;
    private routeDataOptions = new BehaviorSubject<RouteDataOptions | null>(null);
    private cachedLocationHref: string;
    private cachedParsedUrl: ImmutableParsedUrl;
    private locationChanges = new Subject<LocationChangeEvent>();
    private attemptedNavigations = new Subject<ParsedUrl>();
    private lastUrl: string;
    private readonly _doc = inject(DOCUMENT);

    constructor(
        private urlService: UrlService,
        private page: Page,
        private user: UserService,
        private nativeAppService: NativeAppService,
        private nativeAppConfig: NativeAppConfig,
        private router: Router,
        private messageQueueService: MessageQueueService,
        private loadingIndicatorService: LoadingIndicatorService,
        private lastKnownProductService: LastKnownProductService,
        private cookieService: CookieService,
        private timerService: TimerService,
        private headerService: HeaderService,
        private loginStoreService: LoginStoreService,
        private postLoginService: PostLoginService,
    ) {
        this.locationChange.pipe(filter((l: LocationChangeEvent) => l.previousUrl !== l.nextUrl)).subscribe((event: LocationChangeEvent) => {
            this.previousLocation = event.previousUrl;
        });
    }

    /**
     * Provides current url parsed to parts.
     */
    get location(): ImmutableParsedUrl {
        const href = this.#window.location.href;

        if (this.cachedLocationHref !== href) {
            this.cachedParsedUrl = new ImmutableParsedUrl(this.urlService.parse(href));
            this.cachedLocationHref = href;
        }

        return this.cachedParsedUrl;
    }

    /**
     * Observable that provides the previous URL.
     */
    get previousUrl(): string {
        return this.previousLocation;
    }

    /**
     * Observable that provides the route data options. See: {@link RouteDataOptions}
     */
    get routeData(): Observable<RouteDataOptions | null> {
        return this.routeDataOptions;
    }

    /**
     * Notifies subscribers when location changes.
     */
    get locationChange(): Observable<LocationChangeEvent> {
        return this.locationChanges;
    }

    /**
     * Notifies subscribers on navigation attempts.
     */
    get attemptedNavigation(): Observable<ParsedUrl> {
        return this.attemptedNavigations;
    }

    /**
     * Navigates to a url. Based on whether the url is on the same host and same language
     * does a client side navigation (using `Router`) or full page reload (using `window.location.href`).
     */
    async goTo(url: string | ParsedUrl, options?: GoToOptions): Promise<any> {
        const opts: GoToOptions = {
            ...options,
            showSpinnerForExternalNavigation: true,
        };
        const finalUrl = typeof url === 'string' ? this.urlService.parse(url) : url;
        if (this.lastUrl) {
            const lastUrlParsed = this.urlService.parse(this.lastUrl);
            const lastUrlQueryParams = lastUrlParsed.search;

            switch (opts.queryParamsHandling) {
                case 'merge':
                    lastUrlQueryParams.keys().forEach((param) => {
                        if (!finalUrl.search.has(param)) {
                            finalUrl.search.append(param, lastUrlQueryParams.get(param)!);
                        }
                    });
                    break;
                case 'preserve':
                    finalUrl.search = lastUrlQueryParams;
                    break;
                default:
                    break;
            }
        }

        const ssoEnabled = this.page.singleSignOnDomains.some((domain) => finalUrl.hostname.endsWith(domain));

        if (ssoEnabled) {
            this.addGaTrackings(finalUrl);
        }

        if (opts.appendReferrer) {
            if (typeof opts.appendReferrer === 'string') {
                finalUrl.appendReferrer({ url: opts.appendReferrer });
            } else {
                finalUrl.appendReferrer({ absolute: true });
            }
        }

        if (opts.storeMessageQueue) {
            this.messageQueueService.storeMessages();
        }

        if (opts.culture && finalUrl.culture != null && opts.culture !== finalUrl.culture) {
            finalUrl.changeCulture(opts.culture);
        }

        this.attemptedNavigations.next(finalUrl);

        const culture = finalUrl.culture || this.page.lang;

        if (opts.forceReload || !finalUrl.isSameHost || !culture || culture !== this.page.lang) {
            const navigate = () => {
                const targetWindow = opts.forceReloadTarget ? this.#window[opts.forceReloadTarget] : this.#window;

                if (!targetWindow) return;

                if (opts.replace) {
                    targetWindow.location.replace(finalUrl.absUrl());
                } else {
                    targetWindow.location.href = finalUrl.absUrl();
                }
            };

            if (opts.showSpinnerForExternalNavigation && !finalUrl.isSameHost) {
                const loadingIndicator = this.loadingIndicatorService.start({
                    blockScrolling: true,
                    delay: this.page.loadingIndicator.externalNavigationDelay,
                });

                this.timerService.setTimeout(() => loadingIndicator.done(), 5000);
            }

            navigate();

            return new Promise(() => {});
        }

        return this.router
            .navigateByUrl(finalUrl.url(), {
                replaceUrl: !!opts.replace,
                skipLocationChange: !!opts.skipLocationChange,
            })
            .then(async () => {
                if (finalUrl.hash) {
                    const element = this._doc.getElementById(finalUrl.hash);
                    element?.scrollIntoView();
                    await firstValueFrom(this.headerService.whenReady);
                    this.#window.scrollTo(0, this.#window.scrollY - this.headerService.getHeaderHeight());
                }

                if (opts.storeMessageQueue) {
                    this.messageQueueService.restoreMessages();
                }
            });
    }

    /**
     * Navigates back to native app from wrapped web view. Uses special `bwin://` scheme.
     * If there are any messages in {@link MessageQueueService}, it
     * redirects to url provided by that constant.
     */
    goToNativeApp(options?: NativeAppGoToOptions) {
        if (this.messageQueueService.count() > 0) {
            this.goTo('/{culture}/nativeapp/backtoapp', options);
        } else {
            const nativeUrl = this.buildNativeUrl();
            const sendPostLogin = this.shouldSendPostLogin();

            this.navigateToNativeApp(nativeUrl, sendPostLogin, options);
        }
    }

    private buildNativeUrl(): string {
        let nativeUrl = this.nativeAppService.nativeScheme;
        if (!this.nativeAppService.htcmdSchemeEnabled) {
            if (this.user.isAuthenticated) {
                nativeUrl += `${this.user.username}/${this.user.ssoToken}`;
            } else {
                nativeUrl += 'noSso';
            }

            const superCookie = this.cookieService.get(CookieName.SuperCookie);
            if (superCookie) {
                nativeUrl += `/${superCookie}`;
            } else {
                nativeUrl += this.buildPartnerSessionUrl();
            }
        } else {
            nativeUrl = this.nativeAppService.playtechNativeScheme;
            const postLoginValues = this.cookieService.getObject(CookieName.MobileLoginPostLoginValues);
            nativeUrl += `login?username=${this.user.accountId}&password=${postLoginValues?.tempPartnerToken || ''}&type=4`;
        }

        return nativeUrl;
    }

    private buildPartnerSessionUrl(): string {
        if (this.nativeAppConfig.partnerSessionIdSupported) {
            const postLoginValues = this.cookieService.get(CookieName.MobileLoginPostLoginValues);
            const parsedPostLoginValues: { [key: string]: string } = postLoginValues ? JSON.parse(postLoginValues) : {};

            if (parsedPostLoginValues?.['partnerSessionUid']) {
                return `/noSuperCookie/${parsedPostLoginValues['partnerSessionUid']}`;
            }
            return '/noSuperCookie/noPartnerSessionId';
        }
        return '';
    }

    private shouldSendPostLogin(): boolean {
        return this.user.isAuthenticated && (this.nativeAppConfig.sendPostLoginOnGoToNative ?? false);
    }

    private navigateToNativeApp(nativeUrl: string, sendPostLogin: boolean, options?: NativeAppGoToOptions) {
        if (options?.replace) {
            this.#window.location.replace(nativeUrl);
        } else if (!sendPostLogin) {
            this.#window.location.href = nativeUrl;
        } else {
            const postLoginValues = this.loginStoreService.PostLoginValues ?? {};
            const addionalParameters = this.cookieService.getObject(CookieName.AdditionalPostLoginOptions) ?? {};
            this.postLoginService.sendPostLoginEvent(postLoginValues, addionalParameters);
        }
    }

    /** Navigates to last known product */
    goToLastKnownProduct(options?: GoToLastKnownProductOptions) {
        this.handleGoToLastKnownProduct(options, false);
    }

    private async handleGoToLastKnownProduct(options?: GoToLastKnownProductOptions, isAsync?: boolean) {
        const defaultOptions = {
            forceHistoryBack: false,
            forceReload: false,
        };
        const opts: GoToLastKnownProductOptions = {
            ...defaultOptions,
            ...options,
        };

        if (opts.forceHistoryBack && this.#window.history.length && this.previousLocation) {
            this.#window.history.back();
        } else {
            const lastKnownProduct = this.lastKnownProductService.get();
            const backlink = this.urlService.parse(lastKnownProduct.url);
            const goToOptions = {
                forceReload: opts.forceReload,
                culture: opts.culture || this.page.lang,
            };
            isAsync === true ? await this.goTo(backlink, goToOptions) : this.goTo(backlink, goToOptions);
        }
    }

    async goToLastKnownProductAsync(options?: GoToLastKnownProductOptions): Promise<void> {
        await this.handleGoToLastKnownProduct(options, true);
    }

    /** Navigates to return url i.e. rurl parameter */
    goToReturnUrl() {
        const url = this.cookieService.get(CookieName.Rurl);

        if (url) {
            this.goTo(url);
        } else {
            this.goToLastKnownProduct();
        }
    }

    /** stores return url parameter to cookie. */
    storeReturnUrl() {
        // use either "rurl" or "ReturnUrl" (in case of Vanilla based unauth'd redirection)
        const rurlKeys = ['rurl', 'ReturnUrl'];

        const rurl = rurlKeys
            .map((key) => {
                const encoded = this.location.search.get(key);

                return encoded ? decodeURIComponent(encoded) : null;
            })
            .find((v) => v != null);

        if (rurl && !rurl.match(/(javascript|src|onerror|<|>)/g)) {
            this.cookieService.put(CookieName.Rurl, rurl);
        }
    }

    /**
     * @internal
     */
    init() {
        this.lastUrl = this.location.absUrl();

        this.router.events.pipe(filter((e): e is RoutesRecognized => e instanceof RoutesRecognized)).subscribe((e: RoutesRecognized) => {
            const data = this.getRouteData(e.state.root);

            this.routeDataOptions.next(data);
        });

        this.router.events.pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd)).subscribe((e: NavigationEnd) => {
            const nextUrl = this.location.absUrl();

            this.locationChanges.next({
                id: e.id,
                previousUrl: this.lastUrl,
                nextUrl,
            });

            this.lastUrl = nextUrl;
        });
    }

    /** @internal */
    getRouteData(snapshot: ActivatedRouteSnapshot, base: any = {}): RouteDataOptions {
        if (!snapshot.children.length) {
            return snapshot.data;
        }

        return snapshot.children.reduce((a, c: ActivatedRouteSnapshot) => Object.assign(a, this.getRouteData(c, a)), base);
    }

    private addGaTrackings(finalUrl: ParsedUrl) {
        const parentURLDomain = this.urlService.current().host();
        if (finalUrl.hostname != parentURLDomain) {
            const parentURL = `${this.urlService.current().host()}/${this.urlService.current().culture}`;
            finalUrl.search.append('parentURL', parentURL);
            const visitorId = this.getGaVisitId();
            if (visitorId != '' && visitorId != null) {
                finalUrl.search.append('gavisitid', visitorId);
            }

            if (this.user.isAuthenticated && this.user.ssoToken) {
                finalUrl.search.append('_sso', this.user.ssoToken);
            }

            const gaVersion = this.checkGaVersion();

            if (gaVersion === 3) {
                this.handleGa3(finalUrl);
            }

            if (gaVersion === 4 && this.isApplicableG4()) {
                this.handleGa4(finalUrl);
            }
        }
    }

    private checkGaVersion(): number {
        let gaVersion: number = 0;

        try {
            if (this.#window['google_tag_data'].gl.decorators.length > 0) {
                gaVersion = 4;
            } else if (this.#window['ga']) {
                gaVersion = 3;
            }
        } catch (error: any) {
            gaVersion = 0;
        }

        return gaVersion;
    }

    private getGa3LinkerParameter(): any {
        try {
            const window = <any>this.#window;

            if (window.location.hostname) {
                const regExDomainsG3 = this.page.crossDomainRegExG4;

                if (window.location.hostname.match(regExDomainsG3)) {
                    return window.ga.getAll()[0].get('linkerParam');
                }
            }
        } catch (error) {
            return null;
        }
    }

    private isApplicableG4(): boolean {
        try {
            let configuredDomain = false;

            if (this.#window.location.hostname) {
                const regExDomains = this.page.crossDomainRegExG4;
                configuredDomain = !!this.#window.location.hostname.match(regExDomains);
            }

            return configuredDomain;
        } catch (error) {
            return false;
        }
    }

    private getValuesFromGa4(param: string): any {
        try {
            const linkerParamValue = this.#window['ga'].getAll()[0].get('linkerParam');

            let gaglobj = this.#window['google_tag_data'].gl.decorators[0].callback();
            const clientID = gaglobj._ga;
            gaglobj = JSON.stringify(gaglobj);
            const sessionID = gaglobj.split('_ga')[2].split('.')[3];

            switch (param) {
                case 'id':
                    return clientID;
                case 'session':
                    return sessionID;
                case 'linker':
                    return linkerParamValue.replace('_ga=', '');
                default:
                    return null;
            }
        } catch (error) {
            return null;
        }
    }

    private handleGa3(finalUrl: ParsedUrl) {
        const gaLinkerParameter = this.getGa3LinkerParameter();
        if (gaLinkerParameter != null && gaLinkerParameter != '') {
            finalUrl.search.append('_ga', gaLinkerParameter);
        }
    }

    private handleGa4(finalUrl: ParsedUrl) {
        const gaLinkerParameter = this.getValuesFromGa4('linker');
        const gaRawClientID = this.getValuesFromGa4('id');
        const sessionID = this.getValuesFromGa4('session');
        const clientID = this.formatGAClientID(gaRawClientID);
        if (gaLinkerParameter != null && gaLinkerParameter != '') {
            finalUrl.search.append('_ga', gaLinkerParameter);
        }
        if (clientID != null) {
            finalUrl.search.append('gaclientID', clientID);
        }
        if (sessionID != null) {
            finalUrl.search.append('gasessionID', sessionID);
        }
    }

    private formatGAClientID(rawClientID: string) {
        if (!rawClientID) return '';
        const parts = rawClientID.split('.');
        return parts.length >= 3 ? parts.slice(2).join('.') : rawClientID;
    }

    private getGaVisitId(): any {
        if (this.#window['ga']?.getAll && typeof this.#window['ga'].getAll === 'function' && this.#window['ga'].getAll()[0]) {
            const clientIdValue = this.#window['ga'].getAll()[0].get('clientId');
            return this.formatGAClientID(clientIdValue);
        }

        return this.cookieService.get(CookieName.VisitIdCookieName) || '';
    }
}
