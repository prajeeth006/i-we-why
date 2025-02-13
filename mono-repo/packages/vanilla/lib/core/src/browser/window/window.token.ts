import { DOCUMENT } from '@angular/common';
import { InjectionToken, inject } from '@angular/core';

import { CustomWindow } from './window-ref.service';

export const WINDOW = new InjectionToken<CustomWindow>('Safe access window object', {
    providedIn: 'root',
    factory: () => inject(DOCUMENT).defaultView as CustomWindow,
});
