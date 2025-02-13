using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Moq;
using Xunit;

namespace Frontend.Vanilla.DomainSpecificLanguage.Tests.Providers.Contracts;

public class SitecoreDslProviderSyntaxTests : SyntaxTestBase<ISitecoreDslProvider>
{
    [Fact]
    public void GetLink_Test()
    {
        Provider.Setup(p => p.GetLinkAsync(Mode, "App-v1.0/Links/Home")).ReturnsAsync("http://xxx.bwin.com/");
        EvaluateAndExpect("Sitecore.GetLink('App-v1.0/Links/Home')", "http://xxx.bwin.com/");
    }
}
