import { isPlatformBrowser } from '@angular/common';
import { InjectionToken, PLATFORM_ID, Provider } from '@angular/core';

/**
 * Injection token used for retrieving value indicating whether the browser is Safari.
 */
export const IS_SAFARI_BROWSER = new InjectionToken<boolean>('safari-browser-token');

// eslint-disable-next-line @typescript-eslint/ban-types
export function isSafariBrowserFactory(platformId: Object): boolean {
    if (isPlatformBrowser(platformId)) {
        const userAgent = window.navigator.userAgent.toLowerCase();
        return (userAgent.includes('safari') || userAgent.includes('applewebkit')) && !userAgent.includes('chrome');
    }
    return false;
}

export function provideSafariBrowserToken(): Provider {
    return {
        provide: IS_SAFARI_BROWSER,
        useFactory: isSafariBrowserFactory,
        deps: [PLATFORM_ID],
    };
}
