using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Xunit;

namespace Frontend.Vanilla.DomainSpecificLanguage.Tests.Providers.Contracts;

public sealed class RequestHeadersDslProviderSyntaxTests : SyntaxTestBase<IRequestHeadersDslProvider>
{
    [Fact]
    public void GetTest()
    {
        Provider.Setup(p => p.Get("User-Agent")).Returns("Netscape Navigator");
        EvaluateAndExpect("RequestHeaders.Get('User-Agent')", "Netscape Navigator");
    }

    [Fact]
    public void UserAgentTest()
    {
        Provider.SetupGet(p => p.UserAgent).Returns("Netscape Navigator");
        EvaluateAndExpect("RequestHeaders.UserAgent", "Netscape Navigator");
    }
}
