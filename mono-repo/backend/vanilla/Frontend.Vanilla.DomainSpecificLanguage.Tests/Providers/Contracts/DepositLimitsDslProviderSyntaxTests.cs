using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Moq;
using Xunit;

namespace Frontend.Vanilla.DomainSpecificLanguage.Tests.Providers.Contracts;

public class DepositLimitsDslProviderSyntaxTests : SyntaxTestBase<IDepositLimitsDslProvider>
{
    [Fact]
    public void Get_Test()
    {
        Provider.Setup(p => p.GetAsync(Mode, "Daily")).ReturnsAsync(1m);
        EvaluateAndExpect("DepositLimits.Get('Daily')", 1m);
    }

    [Fact]
    public void IsLow_Test()
        => ShouldBeCompilable<bool>("DepositLimits.IsLow('Daily')");
}
