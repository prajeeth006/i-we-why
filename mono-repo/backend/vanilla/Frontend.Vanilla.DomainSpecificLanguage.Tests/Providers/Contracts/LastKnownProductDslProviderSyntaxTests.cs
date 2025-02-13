using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Xunit;

namespace Frontend.Vanilla.DomainSpecificLanguage.Tests.Providers.Contracts;

public class LastKnownProductDslProviderSyntaxTests : SyntaxTestBase<ILastKnownProductDslProvider>
{
    [Fact]
    public void Name_Test()
    {
        Provider.Setup(p => p.Name).Returns("sports");
        EvaluateAndExpect("LastKnownProduct.Name", "sports");
    }

    [Fact]
    public void Previous_Test()
    {
        Provider.Setup(p => p.Previous).Returns("casino");
        EvaluateAndExpect("LastKnownProduct.Previous", "casino");
    }

    [Fact]
    public void Url_Test()
    {
        Provider.Setup(p => p.Url).Returns("www.bwin.com");
        EvaluateAndExpect("LastKnownProduct.Url", "www.bwin.com");
    }
}
