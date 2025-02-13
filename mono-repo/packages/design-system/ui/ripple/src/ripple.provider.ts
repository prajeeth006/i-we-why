import { InjectionToken, Provider } from '@angular/core';

import { DsRippleOptions, DsRippleOptionsOptional } from './ripple.types';

export const DS_RIPPLE_OPTIONS_TOKEN = new InjectionToken<DsRippleOptions>('DS_RIPPLE_GLOBAL_OPTIONS');

export function provideDsRippleOptions(dsRippleOptions: DsRippleOptionsOptional): Provider[] {
    return [{ provide: DS_RIPPLE_OPTIONS_TOKEN, useValue: dsRippleOptions }];
}
