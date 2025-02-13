using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Moq;
using Xunit;

namespace Frontend.Vanilla.DomainSpecificLanguage.Tests.Providers.Contracts;

public class TourneyTokenBalanceDslProviderSyntaxTests : SyntaxTestBase<ITourneyTokenBalanceDslProvider>
{
    [Fact]
    public void Get_Balance()
    {
        Provider.Setup(p => p.GetBalanceAsync(Mode)).ReturnsAsync(10);
        EvaluateAndExpect("TourneyTokenBalance.Balance", 10m);
    }

    [Fact]
    public void Get_Currency()
    {
        Provider.Setup(p => p.GetCurrencyAsync(Mode)).ReturnsAsync("EUR");
        EvaluateAndExpect("TourneyTokenBalance.Currency", "EUR");
    }
}
