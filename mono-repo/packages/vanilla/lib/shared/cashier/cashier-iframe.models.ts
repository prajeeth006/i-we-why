/**
 * @stable
 */
export enum CashierIframeAction {
    Chat = 'CHAT',
    Close = 'CLOSE',
    DepositSuccess = 'DEPOSITSUCCESSQD',
    FetchLocation = 'FETCHLOCATION',
    Open = 'OPEN',
    Resize = 'RESIZE',
    UpdateBalance = 'UPDATEBALANCE',
}

/**
 * @stable
 */
export enum CashierIframeType {
    PaymentPreferences = 'paymentpreferences',
    QuickDeposit = 'quickdeposit',
}

/**
 * @stable
 * @param {target}: quickDeposit by default
 */
export interface CashierIframeEvent {
    action?: string;
    target?: string;

    [key: string]: any;
}
