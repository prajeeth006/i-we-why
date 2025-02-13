/**
 * @whatItDoes Represents balance transfer model.
 *
 * @stable
 */
import { BalanceProperties } from '@frontend/vanilla/core';

export interface BalanceTransfer {
    amount: number;
    fromBalanceType: BalanceType;
    toBalanceType: BalanceType;
}

/**
 * @whatItDoes Represents supported balance types for transfers from/to.
 *
 * @stable
 */
export enum BalanceType {
    PayPalBal = 'PAYPAL_BAL',
    MainRealBal = 'MAIN_REAL_BAL',
}

/**
 * @whatItDoes Represents balance update model.
 */
export interface BalanceUpdate {
    balance: BalanceProperties;
}
