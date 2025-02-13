/**
 * Options for {@link NavigationService#goTo}
 *
 * @stable
 */
export interface GoToOptions {
    /**
     * Adds `rurl` query parameter to the url if set to true. If it is a string, sets `rurl` to the specified string instead of current url.
     */
    appendReferrer?: boolean | string | null;
    /**
     * Replace last browser history record with the new url.
     */
    replace?: boolean;
    /**
     * Force a full page reload.
     */
    forceReload?: boolean | undefined; // Optional undefined
    /**
     * Target window to use for a full page reload.
     */
    forceReloadTarget?: 'self' | 'top' | 'parent' | null;
    /**
     * Stores MessageQueue data in session storage. This data will get restored on next page load. In case of single page navigation, the data is restored immediately when the navigation finishes.
     */
    storeMessageQueue?: boolean;
    /**
     * If the final url would cause a full page reload, shows loading indicator until the page is unloaded (default: true).
     */
    showSpinnerForExternalNavigation?: boolean;
    /**
     * Navigates without changing the url in the browser (client side navigation only).
     */
    skipLocationChange?: boolean;
    /**
     * The culture to use for the url. If it's different that in the url, it will be applied to the url and the page will be reloaded.
     */
    culture?: string;
    /**
     * How to handle the query params of the URL. `merge` will merge previous params with new URL ones, `preserve` will keep previous params only (*new ones will be disconsidered*).
     * Default `undefined`, no change will be made on query params of the new url.
     */
    queryParamsHandling?: 'preserve' | 'merge' | null;
}

/** @stable */
export interface GoToLastKnownProductOptions {
    forceHistoryBack?: boolean;
    forceReload?: boolean;
    culture?: string;
}

/**
 * Options for {@link NavigationService#goToNativeApp}
 *
 * @stable
 */
export interface NativeAppGoToOptions {
    /**
     * Replace last browser history record with the new url.
     */
    replace?: boolean;
    /**
     * Stores MessageQueue data in session storage. If the message queue is not empty, the messages will be restored when the navigation to message panel page is finished.
     */
    storeMessageQueue?: boolean;
    culture?: string;
}

/**
 * @stable
 */
export interface LocationChangeEvent {
    previousUrl: string;
    nextUrl: string;
    id: number;
}

/**
 * Options for {@link ParsedUrl#appendReferrer}
 *
 * @stable
 */
export interface AppendReferrerOptions {
    /**
     * Whether `rurl` should be absolute
     */
    absolute?: boolean;
    /**
     * Override the url used for `rurl`
     */
    url?: string;
}

/**
 * @internal
 */
export interface NavigationUrl {
    href: string;
    isRelative: boolean;
}
