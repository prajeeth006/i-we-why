import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';

/**
 * @description
 * A wrapper for `window` object to make it indexable so properties can be accessed using brackets notation without typescript error.
 */
export interface CustomWindow extends Window {
    [key: string]: any;
}

export enum WindowEvent {
    AnimationEnd = 'animationend',
    BeforeUnload = 'beforeunload',
    Blur = 'blur',
    Change = 'change',
    Click = 'click',
    Error = 'error',
    Focus = 'focus',
    GtmLoad = 'gtm.load',
    Load = 'load',
    Message = 'message',
    Offline = 'offline',
    Online = 'online',
    PageHide = 'pagehide',
    ReadyStateChange = 'readystatechange',
    Scroll = 'scroll',
    SocialCookieDropped = 'socialcookiedropped',
    Storage = 'storage',
    TouchMove = 'touchmove',
    TouchStart = 'touchstart',
    TransitionEnd = 'transitionend',
    VanillaGtmLoaded = 'vanilla_gtm_loaded',
    VisibilityChange = 'visibilitychange',
}

/**
 * @whatItDoes Wraps browser `window`.
 *
 * @howToUse
 *
 * ```
 * // logs current url
 * ```
 *
 * @description
 *
 * This service functions similarly as `$window` in AngularJS. Allows for easy mocking of `window`.
 *
 * @deprecated
 *
 * ```
 * Inject `WINDOW` token inside an injection context:
 * ```
 * import { WINDOW } from '@frontend/vanilla/core';
 * // ...
 * readonly #window = inject(WINDOW);
 * ```
 */
@Injectable({
    providedIn: 'root',
})
export class WindowRef {
    private readonly _doc = inject(DOCUMENT);

    get nativeWindow(): CustomWindow {
        return this._doc.defaultView as CustomWindow;
    }
}
