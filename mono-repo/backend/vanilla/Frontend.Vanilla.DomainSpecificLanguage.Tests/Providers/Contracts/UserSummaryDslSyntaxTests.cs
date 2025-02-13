using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Moq;
using Xunit;

namespace Frontend.Vanilla.DomainSpecificLanguage.Tests.Providers.Contracts;

public class UserSummaryDslSyntaxTests : SyntaxTestBase<IUserSummaryDslProvider>
{
    [Fact]
    public void Loss_Test()
    {
        Provider.Setup(p => p.GetLossAsync(Mode)).ReturnsAsync(0m);
        EvaluateAndExpect("UserSummary.Loss", 0m);
    }

    [Fact]
    public void Profit_Test()
    {
        Provider.Setup(p => p.GetProfitAsync(Mode)).ReturnsAsync(0m);
        EvaluateAndExpect("UserSummary.Profit", 0m);
    }

    [Fact]
    public void NetLoss_Test()
    {
        Provider.Setup(p => p.GetNetLossAsync(Mode)).ReturnsAsync(0m);
        EvaluateAndExpect("UserSummary.NetLoss", 0m);
    }

    [Fact]
    public void PokerTaxCollected_Test()
    {
        Provider.Setup(p => p.GetPokerTaxCollectedAsync(Mode)).ReturnsAsync(10m);
        EvaluateAndExpect("UserSummary.PokerTaxCollected", 10m);
    }

    [Fact]
    public void SportsTaxCollected_Test()
    {
        Provider.Setup(p => p.GetSportsTaxCollectedAsync(Mode)).ReturnsAsync(11m);
        EvaluateAndExpect("UserSummary.SportsTaxCollected", 11m);
    }

    [Fact]
    public void CasinoTaxCollected_Test()
    {
        Provider.Setup(p => p.GetCasinoTaxCollectedAsync(Mode)).ReturnsAsync(10m);
        EvaluateAndExpect("UserSummary.CasinoTaxCollected", 10m);
    }

    [Fact]
    public void NetProfit_Test()
    {
        Provider.Setup(p => p.GetNetProfitAsync(Mode)).ReturnsAsync(0m);
        EvaluateAndExpect("UserSummary.NetProfit", 0m);
    }

    [Fact]
    public void TotalDepositAmount_Test()
    {
        Provider.Setup(p => p.GetTotalDepositAmountAsync(Mode)).ReturnsAsync(0m);
        EvaluateAndExpect("UserSummary.TotalDepositAmount", 0m);
    }

    [Fact]
    public void TotalWithdrawalAmount_Test()
    {
        Provider.Setup(p => p.GetTotalWithdrawalAmountAsync(Mode)).ReturnsAsync(0m);
        EvaluateAndExpect("UserSummary.TotalWithdrawalAmount", 0m);
    }

    [Fact]
    public void Format_Test()
        => ShouldBeCompilable<string>("UserSummary.Format(0)");
}
