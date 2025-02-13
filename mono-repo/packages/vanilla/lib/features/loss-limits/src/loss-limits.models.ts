export enum LossLimitsType {
    DailyLimit = 'DAILY_LIMIT',
    WeeklyLimit = 'WEEKLY_LIMIT',
    MonthLimit = 'MONTHLY_LIMIT',
}

export interface LossLimitsAmounts {
    playerLimitAmount: number;
    totalLossAmount: number;
    pendingLossAmount: number;
    currency: string;
    isMandatory: boolean;
}

export interface LossLimitsDetails extends LossLimitsAmounts {
    usedPercentage: number;
    notificationType: string;
}

export interface LossLimitsEvent {
    [key: string]: LossLimitsAmounts;
}
