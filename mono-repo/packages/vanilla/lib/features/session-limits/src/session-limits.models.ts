export enum SessionLimitType {
    DAILY_LIMIT = 'DAILY_LIMIT',
    MONTHLY_LIMIT = 'MONTHLY_LIMIT',
    SESSION_EXPIRED = 'SESSION_EXPIRED',
    SESSION_TIMEOUT = 'SESSION_TIMEOUT',
    WEEKLY_LIMIT = 'WEEKLY_LIMIT',
}

export interface SessionLimitNotification {
    accountName: string;
    frontend?: string;
    useCase?: string;
    sessionLimits: SessionLimit[];
    isSessionExpired?: boolean; // @Internal
    loginSessionLimitActivity?: LoginSessionLimitActivity[];
    fromSource?: string; // @Internal
}

export interface SessionLimitPreLogoutNotification {
    accountName: string;
    sessionLimits: SessionLimitType[];
    remainingTimeMillis: number;
    configuredTimeMillis: number;
}

export interface SessionLimit {
    sessionLimitType: SessionLimitType | undefined;
    percentageElapsed?: number;
    sessionLimitElaspedMins: number;
    sessionLimitConfiguredMins: number;
}

export interface GreeceSessionLogout {
    accountName: string;
    elapsedPercentage: number;
    logoutType: SessionLimitType;
    globalSessionId: string;
}

export interface LoginSessionLimitActivity {
    globalSessionId: string;
    accountName: string;
    limitTypes?: string[];
}
