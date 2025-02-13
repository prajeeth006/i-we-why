using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Moq;
using Xunit;

namespace Frontend.Vanilla.DomainSpecificLanguage.Tests.Providers.Contracts;

public class BonusBalanceDslProviderSyntaxTests : SyntaxTestBase<IBonusBalanceDslProvider>
{
    [Fact]
    public void Get_Test()
    {
        Provider.Setup(p => p.GetAsync(Mode, "CASINO")).ReturnsAsync(1.1m);
        EvaluateAndExpect("BonusBalance.Get('CASINO')", 1.1m);
    }

    [Fact]
    public void GetByType_Test()
    {
        Provider.Setup(p => p.GetBonusByTypeAsync(Mode, "POKER")).ReturnsAsync(1.2m);
        EvaluateAndExpect("BonusBalance.GetBonusByType('POKER')", 1.2m);
    }
}
