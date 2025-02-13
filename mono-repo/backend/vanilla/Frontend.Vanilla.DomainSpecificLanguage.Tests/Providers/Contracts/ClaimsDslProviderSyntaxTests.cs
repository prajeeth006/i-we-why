using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Xunit;

namespace Frontend.Vanilla.DomainSpecificLanguage.Tests.Providers.Contracts;

public sealed class ClaimsDslProviderSyntaxTests : SyntaxTestBase<IClaimsDslProvider>
{
    [Fact]
    public void GetTest()
    {
        Provider.Setup(p => p.Get("currency")).Returns("Denarius");
        EvaluateAndExpect("Claims.Get('currency')", "Denarius");
    }
}
