import { InjectionToken } from '@angular/core';

export enum RcpuAction {
    Continue = 'CONTINUE',
    Logout = 'LOGOUT',
}

export class SessionInfo {
    balance: number;
    elapsedTime: number;
    totalWagerAmt?: number;
    rcpuAction?: RcpuAction;
    playerState?: string;
}

export const SESSION_INFO = new InjectionToken<SessionInfo>('SESSION_INFO');
