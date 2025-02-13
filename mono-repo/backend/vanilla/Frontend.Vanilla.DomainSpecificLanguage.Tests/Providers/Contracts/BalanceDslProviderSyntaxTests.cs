using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Moq;
using Xunit;

namespace Frontend.Vanilla.DomainSpecificLanguage.Tests.Providers.Contracts;

public class BalanceDslProviderSyntaxTests : SyntaxTestBase<IBalanceDslProvider>
{
    [Fact]
    public void AccountBalance_Test()
    {
        Provider.Setup(p => p.GetAccountBalanceAsync(Mode)).ReturnsAsync(1m);
        EvaluateAndExpect("Balance.AccountBalance", 1m);
    }

    [Fact]
    public void PayPalBalance_Test()
    {
        Provider.Setup(p => p.GetPayPalBalanceAsync(Mode)).ReturnsAsync(2m);
        EvaluateAndExpect("Balance.PayPalBalance", 2m);
    }

    [Fact]
    public void PayPalRestrictedBalance_Test()
    {
        Provider.Setup(p => p.GetPayPalRestrictedBalanceAsync(Mode)).ReturnsAsync(3m);
        EvaluateAndExpect("Balance.PayPalRestrictedBalance", 3m);
    }

    [Fact]
    public void PayPalCashoutableBalance_Test()
    {
        Provider.Setup(p => p.GetPayPalCashoutableBalanceAsync(Mode)).ReturnsAsync(4m);
        EvaluateAndExpect("Balance.PayPalCashoutableBalance", 4m);
    }

    [Fact]
    public void AvailableBalance_Test()
    {
        Provider.Setup(p => p.GetAvailableBalanceAsync(Mode)).ReturnsAsync(5m);
        EvaluateAndExpect("Balance.AvailableBalance", 5m);
    }

    [Fact]
    public void CashoutableBalance_Test()
    {
        Provider.Setup(p => p.GetCashoutableBalanceAsync(Mode)).ReturnsAsync(6m);
        EvaluateAndExpect("Balance.CashoutableBalance", 6m);
    }

    [Fact]
    public void CashoutableBalanceAtOnline_Test()
    {
        Provider.Setup(p => p.GetCashoutableBalanceAtOnlineAsync(Mode)).ReturnsAsync(7m);
        EvaluateAndExpect("Balance.CashoutableBalanceAtOnline", 7m);
    }

    [Fact]
    public void CashoutableBalanceAtRetail_Test()
    {
        Provider.Setup(p => p.GetCashoutableBalanceAtRetailAsync(Mode)).ReturnsAsync(8m);
        EvaluateAndExpect("Balance.CashoutableBalanceAtRetail", 8m);
    }

    [Fact]
    public void CashoutableBalanceReal_Test()
    {
        Provider.Setup(p => p.GetCashoutableBalanceRealAsync(Mode)).ReturnsAsync(9m);
        EvaluateAndExpect("Balance.CashoutableBalanceReal", 9m);
    }

    [Fact]
    public void CashoutRestrictedBalance_Test()
    {
        Provider.Setup(p => p.GetCashoutRestrictedBalanceAsync(Mode)).ReturnsAsync(10m);
        EvaluateAndExpect("Balance.CashoutRestrictedBalance", 10m);
    }

    [Fact]
    public void InPlayAmount_Test()
    {
        Provider.Setup(p => p.GetInPlayAmountAsync(Mode)).ReturnsAsync(11m);
        EvaluateAndExpect("Balance.InPlayAmount", 11m);
    }

    [Fact]
    public void OwedAmount_Test()
    {
        Provider.Setup(p => p.GetOwedAmountAsync(Mode)).ReturnsAsync(12m);
        EvaluateAndExpect("Balance.OwedAmount", 12m);
    }

    [Fact]
    public void PlayMoneyBalance_Test()
    {
        Provider.Setup(p => p.GetPlayMoneyBalanceAsync(Mode)).ReturnsAsync(13m);
        EvaluateAndExpect("Balance.PlayMoneyBalance", 13m);
    }

    [Fact]
    public void PlayMoneyInPlayAmount_Test()
    {
        Provider.Setup(p => p.GetPlayMoneyInPlayAmountAsync(Mode)).ReturnsAsync(14m);
        EvaluateAndExpect("Balance.PlayMoneyInPlayAmount", 14m);
    }

    [Fact]
    public void PokerWinningsRestrictedBalance_Test()
    {
        Provider.Setup(p => p.GetPokerWinningsRestrictedBalanceAsync(Mode)).ReturnsAsync(15m);
        EvaluateAndExpect("Balance.PokerWinningsRestrictedBalance", 15m);
    }

    [Fact]
    public void TaxWithheldAmount_Test()
    {
        Provider.Setup(p => p.GetTaxWithheldAmountAsync(Mode)).ReturnsAsync(16m);
        EvaluateAndExpect("Balance.TaxWithheldAmount", 16m);
    }

    [Fact]
    public void DepositRestrictedBalance_Test()
    {
        Provider.Setup(p => p.GetDepositRestrictedBalanceAsync(Mode)).ReturnsAsync(17m);
        EvaluateAndExpect("Balance.DepositRestrictedBalance", 17m);
    }

    [Fact]
    public void ReleaseRestrictedBalance_Test()
    {
        Provider.Setup(p => p.GetReleaseRestrictedBalanceAsync(Mode)).ReturnsAsync(18m);
        EvaluateAndExpect("Balance.ReleaseRestrictedBalance", 18m);
    }

    [Fact]
    public void CreditCardDepositBalance_Test()
    {
        Provider.Setup(p => p.GetCreditCardDepositBalanceAsync(Mode)).ReturnsAsync(19m);
        EvaluateAndExpect("Balance.CreditCardDepositBalance", 19m);
    }

    [Fact]
    public void CreditCardWinningsBalance_Test()
    {
        Provider.Setup(p => p.GetCreditCardWinningsBalanceAsync(Mode)).ReturnsAsync(20m);
        EvaluateAndExpect("Balance.CreditCardWinningsBalance", 20m);
    }

    [Fact]
    public void DebitCardDepositBalance_Test()
    {
        Provider.Setup(p => p.GetDebitCardDepositBalanceAsync(Mode)).ReturnsAsync(21m);
        EvaluateAndExpect("Balance.DebitCardDepositBalance", 21m);
    }

    [Fact]
    public void UncollectedFunds_Test()
    {
        Provider.Setup(p => p.GetUncollectedFundsAsync(Mode)).ReturnsAsync(22m);
        EvaluateAndExpect("Balance.UncollectedFunds", 22m);
    }

    [Fact]
    public void MainRealBalance_Test()
    {
        Provider.Setup(p => p.GetMainRealBalanceAsync(Mode)).ReturnsAsync(23m);
        EvaluateAndExpect("Balance.MainRealBalance", 23m);
    }

    [Fact]
    public void BalanceForGameType_Test()
    {
        Provider.Setup(p => p.GetBalanceForGameTypeAsync(Mode)).ReturnsAsync(24m);
        EvaluateAndExpect("Balance.BalanceForGameType", 24m);
    }

    [Fact]
    public void BonusWinningsRestrictedBalance_Test()
    {
        Provider.Setup(p => p.GetBonusWinningsRestrictedBalanceAsync(Mode)).ReturnsAsync(25m);
        EvaluateAndExpect("Balance.BonusWinningsRestrictedBalance", 25m);
    }

    [Fact]
    public void CashoutRestrictedCashBalance_Test()
    {
        Provider.Setup(p => p.GetCashoutRestrictedCashBalanceAsync(Mode)).ReturnsAsync(26m);
        EvaluateAndExpect("Balance.CashoutRestrictedCashBalance", 26m);
    }

    [Fact]
    public void SportsDepositBalance_Test()
    {
        Provider.Setup(p => p.GetSportsDepositBalanceAsync(Mode)).ReturnsAsync(27m);
        EvaluateAndExpect("Balance.SportsDepositBalance", 27m);
    }

    [Fact]
    public void SportsExclusiveBalance_Test()
    {
        Provider.Setup(p => p.GetSportsExclusiveBalanceAsync(Mode)).ReturnsAsync(28m);
        EvaluateAndExpect("Balance.SportsExclusiveBalance", 28m);
    }

    [Fact]
    public void SportsWinningsBalance_Test()
    {
        Provider.Setup(p => p.GetSportsWinningsBalanceAsync(Mode)).ReturnsAsync(29m);
        EvaluateAndExpect("Balance.SportsWinningsBalance", 29m);
    }

    [Fact]
    public void PokerWinningsBalance_Test()
    {
        Provider.Setup(p => p.GetPokerWinningsBalanceAsync(Mode)).ReturnsAsync(30m);
        EvaluateAndExpect("Balance.PokerWinningsBalance", 30m);
    }

    [Fact]
    public void SlotsWinningsBalance_Test()
    {
        Provider.Setup(p => p.GetSlotsWinningsBalanceAsync(Mode)).ReturnsAsync(31m);
        EvaluateAndExpect("Balance.SlotsWinningsBalance", 31m);
    }

    [Fact]
    public void SportsRestrictedBalance_Test()
    {
        Provider.Setup(p => p.GetSportsRestrictedBalanceAsync(Mode)).ReturnsAsync(32m);
        EvaluateAndExpect("Balance.SportsRestrictedBalance", 32m);
    }

    [Fact]
    public void PokerRestrictedBalance_Test()
    {
        Provider.Setup(p => p.GetPokerRestrictedBalanceAsync(Mode)).ReturnsAsync(33m);
        EvaluateAndExpect("Balance.PokerRestrictedBalance", 33m);
    }

    [Fact]
    public void SlotsRestrictedBalance_Test()
    {
        Provider.Setup(p => p.GetSlotsRestrictedBalanceAsync(Mode)).ReturnsAsync(34m);
        EvaluateAndExpect("Balance.SlotsRestrictedBalance", 34m);
    }

    [Fact]
    public void AllWinningsBalance_Test()
    {
        Provider.Setup(p => p.GetAllWinningsBalanceAsync(Mode)).ReturnsAsync(35m);
        EvaluateAndExpect("Balance.AllWinningsBalance", 35m);
    }

    [Fact]
    public void MaxLimitExceededBalance_Test()
    {
        Provider.Setup(p => p.GetMaxLimitExceededBalanceAsync(Mode)).ReturnsAsync(36m);
        EvaluateAndExpect("Balance.MaxLimitExceededBalance", 36m);
    }

    [Fact]
    public void GamesDepositBalance_Test()
    {
        Provider.Setup(p => p.GetGamesDepositBalanceAsync(Mode)).ReturnsAsync(33m);
        EvaluateAndExpect("Balance.GamesDepositBalance", 33m);
    }

    [Fact]
    public void PrepaidCardDeposit_Test()
    {
        Provider.Setup(p => p.GetPrepaidCardDepositBalanceAsync(Mode)).ReturnsAsync(34m);
        EvaluateAndExpect("Balance.PrepaidCardDepositBalance", 34m);
    }

    [Fact]
    public void IsLow_Test()
        => ShouldBeCompilable<bool>("Balance.IsLow(123)");

    [Fact]
    public void Format_Test()
        => ShouldBeCompilable<string>("Balance.Format(123)");
}
