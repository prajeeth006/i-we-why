#nullable enable

using Frontend.Vanilla.Core.Utils;
using Frontend.Vanilla.ServiceClients.Services.Common.Currencies;

#pragma warning disable CS1591 // Just dummy data -> no docs needed
namespace Frontend.Vanilla.ServiceClients.Services.Wallet.Balances;

public sealed class Balance(
    Currency accountCurrency,
    decimal accountBalance = 0,
    decimal balanceForGameType = 0,
    decimal bonusWinningsRestrictedBalance = 0,
    decimal cashoutRestrictedBalance = 0,
    decimal cashoutableBalance = 0,
    decimal cashoutableBalanceReal = 0,
    decimal availableBalance = 0,
    decimal depositRestrictedBalance = 0,
    decimal inPlayAmount = 0,
    decimal releaseRestrictedBalance = 0,
    decimal playMoneyBalance = 0,
    decimal playMoneyInPlayAmount = 0,
    decimal owedAmount = 0,
    decimal taxWithheldAmount = 0,
    decimal pokerWinningsRestrictedBalance = 0,
    decimal cashoutRestrictedCashBalance = 0,
    decimal cashoutableBalanceAtOnline = 0,
    decimal cashoutableBalanceAtRetail = 0,
    decimal creditCardDepositBalance = 0,
    decimal creditCardWinningsBalance = 0,
    decimal debitCardDepositBalance = 0,
    decimal mainRealBalance = 0,
    decimal uncollectedFunds = 0,
    decimal payPalBalance = 0,
    decimal payPalRestrictedBalance = 0,
    decimal payPalCashoutableBalance = 0,
    decimal sportsExclusiveBalance = 0,
    decimal sportsDepositBalance = 0,
    decimal gamesDepositBalance = 0,
    decimal sportsWinningsBalance = 0,
    decimal pokerWinningsBalance = 0,
    decimal slotsWinningsBalance = 0,
    decimal sportsRestrictedBalance = 0,
    decimal pokerRestrictedBalance = 0,
    decimal slotsRestrictedBalance = 0,
    decimal allWinningsBalance = 0,
    decimal maxLimitExceededBalance = 0,
    decimal prepaidCardDepositBalance = 0)
{
    public Currency AccountCurrency { get; } = Guard.NotNull(accountCurrency, nameof(accountCurrency));
    public decimal AccountBalance { get; } = accountBalance;
    public decimal BalanceForGameType { get; } = balanceForGameType;
    public decimal BonusWinningsRestrictedBalance { get; } = bonusWinningsRestrictedBalance;
    public decimal CashoutRestrictedBalance { get; } = cashoutRestrictedBalance;
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
    public decimal PayPalBalance { get; } = payPalBalance;
    public decimal PayPalRestrictedBalance { get; } = payPalRestrictedBalance;
    public decimal PayPalCashoutableBalance { get; } = payPalCashoutableBalance;
    public decimal SportsExclusiveBalance { get; } = sportsExclusiveBalance;
    public decimal SportsDepositBalance { get; } = sportsDepositBalance;
    public decimal GamesDepositBalance { get; } = gamesDepositBalance;
    public decimal SportsWinningsBalance { get; } = sportsWinningsBalance;
    public decimal SportsRestrictedBalance { get; } = sportsRestrictedBalance;
    public decimal PokerWinningsBalance { get; } = pokerWinningsBalance;
    public decimal PokerRestrictedBalance { get; } = pokerRestrictedBalance;
    public decimal SlotsWinningsBalance { get; } = slotsWinningsBalance;
    public decimal SlotsRestrictedBalance { get; } = slotsRestrictedBalance;
    public decimal AllWinningsBalance { get; } = allWinningsBalance;
    public decimal MaxLimitExceededBalance { get; } = maxLimitExceededBalance;
    public decimal PrepaidCardDepositBalance { get; } = prepaidCardDepositBalance;

    internal static Balance Create(BalancePosApiDto dto, Currency currency)
        => new Balance(
            accountBalance: dto.AccountBalance,
            accountCurrency: currency,
            balanceForGameType: dto.BalanceForGameType,
            bonusWinningsRestrictedBalance: dto.BonusWinningsRestrictedBalance,
            cashoutRestrictedBalance: dto.CashoutRestrictedBalance,
            cashoutableBalance: dto.CashoutableBalance,
            cashoutableBalanceReal: dto.CashoutableBalanceReal,
            availableBalance: dto.AvailableBalance,
            depositRestrictedBalance: dto.DepositRestrictedBalance,
            inPlayAmount: dto.InPlayAmount,
            releaseRestrictedBalance: dto.ReleaseRestrictedBalance,
            playMoneyBalance: dto.PlayMoneyBalance,
            playMoneyInPlayAmount: dto.PlayMoneyInPlayAmount,
            owedAmount: dto.OwedAmount,
            taxWithheldAmount: dto.TaxWithheldAmount,
            pokerWinningsRestrictedBalance: dto.PokerWinningsRestrictedBalance,
            cashoutRestrictedCashBalance: dto.CashoutRestrictedCashBalance,
            cashoutableBalanceAtOnline: dto.CashoutableBalanceAtOnline,
            cashoutableBalanceAtRetail: dto.CashoutableBalanceAtRetail,
            creditCardDepositBalance: dto.CreditCardDepositBalance,
            creditCardWinningsBalance: dto.CreditCardWinningsBalance,
            debitCardDepositBalance: dto.DebitCardDepositBalance,
            mainRealBalance: dto.MainRealBalance,
            uncollectedFunds: dto.UncollectedFunds,
            payPalBalance: dto.PayPalBalance,
            payPalRestrictedBalance: dto.PayPalRestrictedBalance,
            payPalCashoutableBalance: dto.PayPalCashoutableBalance,
            sportsExclusiveBalance: dto.SportsExclusiveBalance,
            sportsDepositBalance: dto.SportsDepositBalance,
            gamesDepositBalance: dto.GamesDepositBalance,
            sportsWinningsBalance: dto.SportsWinningsBalance,
            pokerWinningsBalance: dto.PokerWinningsBalance,
            slotsWinningsBalance: dto.SlotsWinningsBalance,
            sportsRestrictedBalance: dto.SportsRestrictedBalance,
            pokerRestrictedBalance: dto.PokerRestrictedBalance,
            slotsRestrictedBalance: dto.SlotsRestrictedBalance,
            allWinningsBalance: dto.AllWinningsBalance,
            maxLimitExceededBalance: dto.MaxLimitExceededBalance,
            prepaidCardDepositBalance: dto.PrepaidCardDepositBalance);

    internal static Balance Create(CrossProductBalanceCachedDto crossProductDto, ProductSpecificBalanceCachedDto productSpecificDto)
        => new Balance(
            accountBalance: crossProductDto.AccountBalance,
            accountCurrency: crossProductDto.AccountCurrency,
            balanceForGameType: productSpecificDto.BalanceForGameType,
            bonusWinningsRestrictedBalance: crossProductDto.BonusWinningsRestrictedBalance,
            cashoutRestrictedBalance: productSpecificDto.CashoutRestrictedBalance,
            cashoutableBalance: crossProductDto.CashoutableBalance,
            cashoutableBalanceReal: crossProductDto.CashoutableBalanceReal,
            availableBalance: crossProductDto.AvailableBalance,
            depositRestrictedBalance: crossProductDto.DepositRestrictedBalance,
            inPlayAmount: crossProductDto.InPlayAmount,
            releaseRestrictedBalance: crossProductDto.ReleaseRestrictedBalance,
            playMoneyBalance: crossProductDto.PlayMoneyBalance,
            playMoneyInPlayAmount: crossProductDto.PlayMoneyInPlayAmount,
            owedAmount: crossProductDto.OwedAmount,
            taxWithheldAmount: crossProductDto.TaxWithheldAmount,
            pokerWinningsRestrictedBalance: crossProductDto.PokerWinningsRestrictedBalance,
            cashoutRestrictedCashBalance: crossProductDto.CashoutRestrictedCashBalance,
            cashoutableBalanceAtOnline: crossProductDto.CashoutableBalanceAtOnline,
            cashoutableBalanceAtRetail: crossProductDto.CashoutableBalanceAtRetail,
            creditCardDepositBalance: crossProductDto.CreditCardDepositBalance,
            creditCardWinningsBalance: crossProductDto.CreditCardWinningsBalance,
            debitCardDepositBalance: crossProductDto.DebitCardDepositBalance,
            mainRealBalance: crossProductDto.MainRealBalance,
            uncollectedFunds: crossProductDto.UncollectedFunds,
            payPalBalance: productSpecificDto.PayPalBalance,
            payPalRestrictedBalance: productSpecificDto.PayPalRestrictedBalance,
            payPalCashoutableBalance: crossProductDto.PayPalCashoutableBalance,
            sportsExclusiveBalance: crossProductDto.SportsExclusiveBalance,
            sportsDepositBalance: crossProductDto.SportsDepositBalance,
            gamesDepositBalance: crossProductDto.GamesDepositBalance,
            sportsWinningsBalance: crossProductDto.SportsWinningsBalance,
            pokerWinningsBalance: crossProductDto.PokerWinningsBalance,
            slotsWinningsBalance: crossProductDto.SlotsWinningsBalance,
            sportsRestrictedBalance: crossProductDto.SportsRestrictedBalance,
            pokerRestrictedBalance: crossProductDto.PokerRestrictedBalance,
            slotsRestrictedBalance: crossProductDto.SlotsRestrictedBalance,
            allWinningsBalance: crossProductDto.AllWinningsBalance,
            maxLimitExceededBalance: crossProductDto.MaxLimitExceededBalance,
            prepaidCardDepositBalance: crossProductDto.PrepaidCardDepositBalance);
}
