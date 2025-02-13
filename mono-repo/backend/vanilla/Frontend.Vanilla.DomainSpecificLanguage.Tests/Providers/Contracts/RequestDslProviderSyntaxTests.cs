using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Frontend.Vanilla.Testing.Xunit;
using Xunit;

namespace Frontend.Vanilla.DomainSpecificLanguage.Tests.Providers.Contracts;

public sealed class RequestDslProviderSyntaxTests : SyntaxTestBase<IRequestDslProvider>
{
    [Fact]
    public void AbsoluteUriTest()
    {
        Provider.SetupGet(p => p.AbsoluteUri).Returns("http://www.bwin.com/path?q=1");
        EvaluateAndExpect("Request.AbsoluteUri", "http://www.bwin.com/path?q=1");
    }

    [Fact]
    public void AbsolutePathTest()
    {
        Provider.SetupGet(p => p.AbsolutePath).Returns("/abs/path");
        EvaluateAndExpect("Request.AbsolutePath", "/abs/path");
    }

    [Fact]
    public void PathAndQueryTest()
    {
        Provider.SetupGet(p => p.PathAndQuery).Returns("/path?q=1");
        EvaluateAndExpect("Request.PathAndQuery", "/path?q=1");
    }

    [Fact]
    public void QueryTest()
    {
        Provider.SetupGet(p => p.Query).Returns("?q=1");
        EvaluateAndExpect("Request.Query", "?q=1");
    }

    [Fact]
    public void HostTest()
    {
        Provider.SetupGet(p => p.Host).Returns("www.bwin.com");
        EvaluateAndExpect("Request.Host", "www.bwin.com");
    }

    [Theory, BooleanData]
    public void IsInternalTest(bool isInternal)
    {
        Provider.SetupGet(p => p.IsInternal).Returns(isInternal);
        EvaluateAndExpect("Request.IsInternal", isInternal);
    }

    [Fact]
    public void CultureTokenTest()
    {
        Provider.SetupGet(p => p.CultureToken).Returns("en");
        EvaluateAndExpect("Request.CultureToken", "en");
    }

    [Theory, BooleanData]
    public void IsPrerenderedTest(bool isPrerendered)
    {
        Provider.Setup(p => p.IsPrerendered).Returns(isPrerendered);
        EvaluateAndExpect("Request.IsPrerendered", isPrerendered);
    }

    [Fact]
    public void ClientIPTest()
    {
        Provider.SetupGet(p => p.ClientIP).Returns("1.2.3.4");
        EvaluateAndExpect("Request.ClientIP", "1.2.3.4");
    }

    [Fact]
    public void RedirectSimpleTest()
    {
        Execute("Request.Redirect('/page')");
        Provider.Verify(p => p.Redirect("/page"));
    }

    [Fact]
    public void RedirectWithDetailsTest()
    {
        Execute("Request.Redirect('/page', FALSE, TRUE)");
        Provider.Verify(p => p.Redirect("/page", false, true));
    }
}
