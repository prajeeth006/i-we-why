import { InjectionToken } from '@angular/core';

export interface SessionLimitLogoutEvent {
    accountName: string;
    currentLimit: number;
}

export const SESSION_LIMITS_LOGOUT_POPUP = new InjectionToken<number>('SESSION_LIMITS_LOGOUT_POPUP');
