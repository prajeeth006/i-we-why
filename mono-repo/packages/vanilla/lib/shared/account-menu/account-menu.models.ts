import { MenuContentItem } from '@frontend/vanilla/core';

/** @stable */
export const BOTTOM_DRAWER_HEIGHT = 50;

/** @stable */
export enum AccountMenuTaskStatus {
    URGENT = 'URGENT',
    PENDING = 'PENDING',
}

/** @stable */
export enum DrawerPosition {
    Bottom = 0,
    Middle = 1,
}

/** @stable */
export interface DrawerPositionSettings {
    position: DrawerPosition;
    height: number;
    isAutomaticallyOpened?: boolean;
}

/** @stable */
export enum CashbackType {
    Poker = 'poker',
    Casino = 'casino',
    Coral = 'coral',
}

/** @stable */
export interface AccountMenuContentMain {
    cashbackType: string;
    ignoreVipLevel: boolean;
    isPaypalBalanceMessageEnabled: string;
    isPaypalReleaseFundsEnabled: string;
    onboarding: Onboarding;
    onboardingEnabled: boolean;
    pokerCashbackTournamentAwardTypes: string[];
    profilePageItemsPosition: { [key: string]: number };
    root: MenuContentItem;
    showHeaderBarClose: boolean;
    tournamentPokerCashbackSymbol: string;
    useLoyaltyBannerV2: boolean;
    version: number;
    vipLevels: string[];
}

/** @stable */
export interface OnBoardingContent {
    startTourScreen: MenuContentItem;
    tourItems: any;
}

/** @stable */
export interface Onboarding {
    showAccountMenuHotspotLoginCount: number;
}
