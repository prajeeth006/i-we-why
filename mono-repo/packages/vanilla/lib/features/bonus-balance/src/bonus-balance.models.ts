/**
 * @stable
 */
export type BonusBalance = { [product: string]: number };

export interface ProductBonusInfo {
    bonuses: Bonus[];
}

export interface Bonus {
    bonusAmount: number;
    isBonusActive: boolean;
    applicableProducts: string[];
}

export type BonusBalanceResponse = { [product: string]: ProductBonusInfo };
