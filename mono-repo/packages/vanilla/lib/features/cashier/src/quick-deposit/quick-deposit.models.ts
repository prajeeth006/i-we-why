/** @stable */
export interface QuickDepositEvent {
    action: QuickDepositAction;
    options: QuickDepositOptions;
}

/** @stable */
export interface QuickDepositOptions {
    showKYCVerifiedMessage?: boolean;
}

/** @stable */
export enum QuickDepositAction {
    Open = 'Open',
}
