using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Xunit;

namespace Frontend.Vanilla.DomainSpecificLanguage.Tests.Providers.Contracts;

public sealed class EpcotDslProviderSyntaxTests : SyntaxTestBase<IEpcotDslProvider>
{
    [Fact]
    public void Environment_Test()
    {
        Provider.Setup(p => p.IsEnabled("header")).Returns(true);
        EvaluateAndExpect("Epcot.IsEnabled('header')", true);
    }
}
