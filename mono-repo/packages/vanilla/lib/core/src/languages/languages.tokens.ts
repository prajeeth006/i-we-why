import { InjectionToken } from '@angular/core';

import { getCookieRaw } from '../utils/cookie';

export const LANG_ID = new InjectionToken<string>('language id', { providedIn: 'root', factory: languageRouteValueFactory });

export function languageRouteValueFactory() {
    return getCookieRaw('lang') || 'en';
}
