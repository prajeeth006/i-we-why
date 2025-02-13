#nullable enable

using Frontend.Vanilla.Core.Utils;
using Frontend.Vanilla.ServiceClients.Services.Common.Currencies;

namespace Frontend.Vanilla.ServiceClients.Services.Wallet.Balances;

/// <summary>
/// Part of <see cref="Balance" /> which is same for all product apps so it's cached accordingly.
/// </summary>
internal sealed class CrossProductBalanceCachedDto(
    decimal accountBalance,
    Currency accountCurrency,
    decimal bonusWinningsRestrictedBalance,
    decimal cashoutableBalance,
    decimal cashoutableBalanceReal,
    decimal availableBalance,
    decimal depositRestrictedBalance,
    decimal inPlayAmount,
    decimal releaseRestrictedBalance,
    decimal playMoneyBalance,
    decimal playMoneyInPlayAmount,
    decimal owedAmount,
    decimal taxWithheldAmount,
    decimal pokerWinningsRestrictedBalance,
    decimal cashoutRestrictedCashBalance,
    decimal cashoutableBalanceAtOnline,
    decimal cashoutableBalanceAtRetail,
    decimal creditCardDepositBalance,
    decimal creditCardWinningsBalance,
    decimal debitCardDepositBalance,
    decimal mainRealBalance,
    decimal uncollectedFunds,
    decimal payPalCashoutableBalance,
    decimal sportsExclusiveBalance,
    decimal sportsDepositBalance,
    decimal gamesDepositBalance,
    decimal sportsWinningsBalance,
    decimal pokerWinningsBalance,
    decimal slotsWinningsBalance,
    decimal sportsRestrictedBalance,
    decimal pokerRestrictedBalance,
    decimal slotsRestrictedBalance,
    decimal allWinningsBalance,
    decimal maxLimitExceededBalance,
    decimal prepaidCardDepositBalance)
{
    public decimal AccountBalance { get; } = accountBalance;
    public Currency AccountCurrency { get; } = Guard.NotNull(accountCurrency, nameof(accountCurrency));
    public decimal BonusWinningsRestrictedBalance { get; } = bonusWinningsRestrictedBalance;
    public decimal CashoutableBalance { get; } = cashoutableBalance;
    public decimal CashoutableBalanceReal { get; } = cashoutableBalanceReal;
    public decimal AvailableBalance { get; } = availableBalance;
    public decimal DepositRestrictedBalance { get; } = depositRestrictedBalance;
    public decimal InPlayAmount { get; } = inPlayAmount;
    public decimal ReleaseRestrictedBalance { get; } = releaseRestrictedBalance;
    public decimal PlayMoneyBalance { get; } = playMoneyBalance;
    public decimal PlayMoneyInPlayAmount { get; } = playMoneyInPlayAmount;
    public decimal OwedAmount { get; } = owedAmount;
    public decimal TaxWithheldAmount { get; } = taxWithheldAmount;
    public decimal PokerWinningsRestrictedBalance { get; } = pokerWinningsRestrictedBalance;
    public decimal CashoutRestrictedCashBalance { get; } = cashoutRestrictedCashBalance;
    public decimal CashoutableBalanceAtOnline { get; } = cashoutableBalanceAtOnline;
    public decimal CashoutableBalanceAtRetail { get; } = cashoutableBalanceAtRetail;
    public decimal CreditCardDepositBalance { get; } = creditCardDepositBalance;
    public decimal CreditCardWinningsBalance { get; } = creditCardWinningsBalance;
    public decimal DebitCardDepositBalance { get; } = debitCardDepositBalance;
    public decimal MainRealBalance { get; } = mainRealBalance;
    public decimal UncollectedFunds { get; } = uncollectedFunds;
    public decimal PayPalCashoutableBalance { get; } = payPalCashoutableBalance;
    public decimal SportsExclusiveBalance { get; } = sportsExclusiveBalance;
    public decimal SportsDepositBalance { get; } = sportsDepositBalance;
    public decimal GamesDepositBalance { get; } = gamesDepositBalance;
    public decimal SportsWinningsBalance { get; } = sportsWinningsBalance;
    public decimal PokerWinningsBalance { get; } = pokerWinningsBalance;
    public decimal SlotsWinningsBalance { get; } = slotsWinningsBalance;
    public decimal SportsRestrictedBalance { get; } = sportsRestrictedBalance;
    public decimal PokerRestrictedBalance { get; } = pokerRestrictedBalance;
    public decimal SlotsRestrictedBalance { get; } = slotsRestrictedBalance;
    public decimal AllWinningsBalance { get; } = allWinningsBalance;
    public decimal MaxLimitExceededBalance { get; } = maxLimitExceededBalance;
    public decimal PrepaidCardDepositBalance { get; } = prepaidCardDepositBalance;

    public static CrossProductBalanceCachedDto Create(Balance balance)
        => new CrossProductBalanceCachedDto(
            accountBalance: balance.AccountBalance,
            accountCurrency: balance.AccountCurrency,
            bonusWinningsRestrictedBalance: balance.BonusWinningsRestrictedBalance,
            cashoutableBalance: balance.CashoutableBalance,
            cashoutableBalanceReal: balance.CashoutableBalanceReal,
            availableBalance: balance.AvailableBalance,
            depositRestrictedBalance: balance.DepositRestrictedBalance,
            inPlayAmount: balance.InPlayAmount,
            releaseRestrictedBalance: balance.ReleaseRestrictedBalance,
            playMoneyBalance: balance.PlayMoneyBalance,
            playMoneyInPlayAmount: balance.PlayMoneyInPlayAmount,
            owedAmount: balance.OwedAmount,
            taxWithheldAmount: balance.TaxWithheldAmount,
            pokerWinningsRestrictedBalance: balance.PokerWinningsRestrictedBalance,
            cashoutRestrictedCashBalance: balance.CashoutRestrictedCashBalance,
            cashoutableBalanceAtOnline: balance.CashoutableBalanceAtOnline,
            cashoutableBalanceAtRetail: balance.CashoutableBalanceAtRetail,
            creditCardDepositBalance: balance.CreditCardDepositBalance,
            creditCardWinningsBalance: balance.CreditCardWinningsBalance,
            debitCardDepositBalance: balance.DebitCardDepositBalance,
            mainRealBalance: balance.MainRealBalance,
            uncollectedFunds: balance.UncollectedFunds,
            payPalCashoutableBalance: balance.PayPalCashoutableBalance,
            sportsExclusiveBalance: balance.SportsExclusiveBalance,
            sportsDepositBalance: balance.SportsDepositBalance,
            gamesDepositBalance: balance.GamesDepositBalance,
            sportsWinningsBalance: balance.SportsWinningsBalance,
            pokerWinningsBalance: balance.PokerWinningsBalance,
            slotsWinningsBalance: balance.SlotsWinningsBalance,
            sportsRestrictedBalance: balance.SportsRestrictedBalance,
            pokerRestrictedBalance: balance.PokerRestrictedBalance,
            slotsRestrictedBalance: balance.SlotsRestrictedBalance,
            allWinningsBalance: balance.AllWinningsBalance,
            maxLimitExceededBalance: balance.MaxLimitExceededBalance,
            prepaidCardDepositBalance: balance.PrepaidCardDepositBalance);
}
