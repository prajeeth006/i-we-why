export interface LoyaltyCashback {
    optinStatus: boolean;
    cashbackAmount: number;
    cashbackCurrency: string;
    minEligibleAmount: number;
    minEligibleAmountCurrency: string;
}

export interface CoralCashback {
    optinStatus: boolean;
    cashbackAmount: number;
    cashbackCurrency: string;
    eligibleForClaim: boolean;
    claimedAmount: number;
    claimedAmountCurrency: string;
    currentPoints: number;
    lifeTimePoints: number;
    pointsBalanceAfterClaim: number;
    minPointsReqForRedeem: number;
}

export interface PokerCashback {
    isOptin: string;
    weeklyPoints: number;
    nextSlabPoints: number;
    currency: string;
    targetCashback: string;
    awardType: string;
    hasOptedIn: boolean;
    pointsRequiredForNextSlab: number;
}

export interface MLifeProfile {
    mlifeNo: number;
    tier: string;
    tierDesc: string;
    tierCredits: number;
}

export interface ProfitLoss {
    totalReturn: number;
    totalStake: number;
    weeklyAverage: number;
    monthlyAverage: number;
    yearlyAverage: number;
}

export interface NetDeposit {
    netDeposit: number;
    netWithdrawal: number;
    netLoss: number;
}

export interface AverageDeposit {
    labelAverageDepositAmount: number;
    userAverageDepositAmount: number;
}

export class LossLimit {
    totalNetDeposit: number;
    limitType: LimitType;
    totalLossLimit: number;
}

export class SessionSummary {
    aggregationType: SessionSummaryType;
    sessionSummary: SessionSummaryData;
    startDate: string;
    endDate: string;
}

export interface SessionSummaryData {
    currentAverage: number;
    pastAverage: number;
    productCumulative: ProductCumulative;
}

export interface ProductCumulative {
    active: Product;
    passive: Product;
}

export interface Product {
    sportsbook: number;
    poker: number;
    casino: number;
    bingo: number;
}

export interface PercentByProduct {
    product: string;
    colorClass: string;
    percentage: number;
}

export interface ProfitLossModel {
    rangeText: string;
    totalReturn?: number;
    totalStake?: number;
    balance?: number;
    arrowClass?: string | null;
}

export interface NetDepositModel {
    rangeText: string;
    totalDeposit?: number;
    totalWithdrawals?: number;
    balance?: number;
    arrowClass?: string | null;
}

export interface LossLimitModel {
    totalLossLimit: number;
    totalNetDeposit: number;
    arrowClass: string | null;
    percentageElapsed: number;
    limitText: string;
    remainingDeposit: number;
    description: string;
    limitReachedText: string;
    limitNotReachedText: string;
}

export interface LoyaltyCashbackModel {
    title: string;
    link: {
        text: string;
        url: string;
        cssClass: string | null;
    };
}

export type LimitType = 'MONTHLY' | 'YEARLY';

export type SessionSummaryType = 'DAILY' | 'WEEKLY' | 'YEARLY';
