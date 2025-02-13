/**
 * @whatItDoes Represents user claim types.
 *
 * @stable
 */
export enum ClaimType {
    Currency = 'currency',
    TierCode = 'tierCode',
    VipLevel = 'vipLevel',
    IsPartiallyRegistered = 'ispartiallyregistered',
    SessionToken = 'sessiontoken',
    UserToken = 'usertoken',
    Email = 'email',
    DateOfBirth = 'dateofbirth',
    GivenName = 'givenname',
    Surname = 'surname',
    SecondSurname = 'secondsurname',
}

/**
 * @whatItDoes Represents user balance split into multiple properties.
 *
 * @stable
 */
export interface BalanceProperties {
    // Not returned from api.
    propagateRefresh: boolean;

    accountBalance: number;
    availableBalance: number;
    balanceForGameType: number;
    bonusWinningsRestrictedBalance: number;
    cashoutRestrictedBalance: number;
    cashoutRestrictedCashBalance: number;
    cashoutableBalance: number;
    cashoutableBalanceReal: number;
    depositRestrictedBalance: number;
    inPlayAmount: number;
    owedAmount: number;
    releaseRestrictedBalance: number;
    taxWithheldAmount: number;
    accountCurrency: { id: string; name: string };
    playMoneyBalance: number;
    playMoneyInPlayAmount: number;
    pokerWinningsRestrictedBalance: number;
    cashoutableBalanceAtOnline: number;
    cashoutableBalanceAtRetail: number;
    creditCardDepositBalance: number;
    creditCardWinningsBalance: number;
    debitCardDepositBalance: number;
    mainRealBalance: number;
    uncollectedFunds: number;
    payPalBalance: number;
    payPalRestrictedBalance: number;
    payPalCashoutableBalance: number;
    sportsExclusiveBalance: number;
    sportsDepositBalance: number;
    gamesDepositBalance: number;
    sportsWinningsBalance: number;
    pokerWinningsBalance: number;
    slotsWinningsBalance: number;
    sportsRestrictedBalance: number;
    pokerRestrictedBalance: number;
    slotsRestrictedBalance: number;
    allWinningsBalance: number;
    maxLimitExceededBalance: number;
    prepaidCardDepositBalance: number;
}
