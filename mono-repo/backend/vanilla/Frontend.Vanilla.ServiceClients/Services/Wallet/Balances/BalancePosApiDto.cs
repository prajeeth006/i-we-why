#nullable enable
#pragma warning disable 1591
namespace Frontend.Vanilla.ServiceClients.Services.Wallet.Balances;

public class BalancePosApiDto
{
    public decimal AccountBalance { get; set; }
    public string? AccountCurrency { get; set; }
    public decimal BalanceForGameType { get; set; }
    public decimal BonusWinningsRestrictedBalance { get; set; }
    public decimal CashoutRestrictedBalance { get; set; }
    public decimal CashoutableBalance { get; set; }
    public decimal CashoutableBalanceAtOnline { get; set; }
    public decimal CashoutableBalanceAtRetail { get; set; }
    public decimal CreditCardDepositBalance { get; set; }
    public decimal CreditCardWinningsBalance { get; set; }
    public decimal DebitCardDepositBalance { get; set; }
    public decimal MainRealBalance { get; set; }
    public decimal UncollectedFunds { get; set; }
    public decimal CashoutableBalanceReal { get; set; }
    public decimal AvailableBalance { get; set; }
    public decimal DepositRestrictedBalance { get; set; }
    public decimal InPlayAmount { get; set; }
    public decimal ReleaseRestrictedBalance { get; set; }
    public decimal PlayMoneyBalance { get; set; }
    public decimal PlayMoneyInPlayAmount { get; set; }
    public decimal OwedAmount { get; set; }
    public decimal TaxWithheldAmount { get; set; }
    public decimal PokerWinningsRestrictedBalance { get; set; }
    public decimal CashoutRestrictedCashBalance { get; set; }
    public decimal PayPalBalance { get; set; }
    public decimal PayPalRestrictedBalance { get; set; }
    public decimal PayPalCashoutableBalance { get; set; }
    public decimal SportsExclusiveBalance { get; set; }
    public decimal SportsDepositBalance { get; set; }
    public decimal GamesDepositBalance { get; set; }
    public decimal SportsWinningsBalance { get; set; }
    public decimal PokerWinningsBalance { get; set; }
    public decimal SlotsWinningsBalance { get; set; }
    public decimal SportsRestrictedBalance { get; set; }
    public decimal PokerRestrictedBalance { get; set; }
    public decimal SlotsRestrictedBalance { get; set; }
    public decimal AllWinningsBalance { get; set; }
    public decimal MaxLimitExceededBalance { get; set; }
    public decimal PrepaidCardDepositBalance { get; set; }
}
