using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Moq;
using Xunit;

namespace Frontend.Vanilla.DomainSpecificLanguage.Tests.Providers.Contracts;

public class SessionFundSummaryDslProviderSyntaxTests : SyntaxTestBase<ISessionFundSummaryDslProvider>
{
    [Fact]
    public void Profit_Test()
    {
        Provider.Setup(p => p.GetProfitAsync(Mode)).ReturnsAsync(0m);
        EvaluateAndExpect("SessionFundSummary.Profit", 0m);
    }

    [Fact]
    public void TotalStake_Test()
    {
        Provider.Setup(p => p.GetTotalStakeAsync(Mode)).ReturnsAsync(0m);
        EvaluateAndExpect("SessionFundSummary.TotalStake", 0m);
    }

    [Fact]
    public void Loss_Test()
    {
        Provider.Setup(p => p.GetLossAsync(Mode)).ReturnsAsync(0m);
        EvaluateAndExpect("SessionFundSummary.Loss", 0m);
    }

    [Fact]
    public void InitialBalance_Test()
    {
        Provider.Setup(p => p.GetInitialBalanceAsync(Mode)).ReturnsAsync(0m);
        EvaluateAndExpect("SessionFundSummary.InitialBalance", 0m);
    }

    [Fact]
    public void CurrentBalance_Test()
    {
        Provider.Setup(p => p.GetCurrentBalanceAsync(Mode)).ReturnsAsync(0m);
        EvaluateAndExpect("SessionFundSummary.CurrentBalance", 0m);
    }
}
