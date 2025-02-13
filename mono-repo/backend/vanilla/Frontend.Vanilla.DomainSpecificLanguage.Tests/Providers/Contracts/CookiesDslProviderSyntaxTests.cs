using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Xunit;

namespace Frontend.Vanilla.DomainSpecificLanguage.Tests.Providers.Contracts;

public sealed class CookiesDslProviderSyntaxTests : SyntaxTestBase<ICookiesDslProvider>
{
    [Fact]
    public void LabelDomainTest()
    {
        Provider.SetupGet(p => p.LabelDomain).Returns(".bwin.com");
        EvaluateAndExpect("Cookies.LabelDomain", ".bwin.com");
    }

    [Fact]
    public void FullDomainTest()
    {
        Provider.SetupGet(p => p.FullDomain).Returns("sports.bwin.com");
        EvaluateAndExpect("Cookies.FullDomain", "sports.bwin.com");
    }

    [Fact]
    public void GetTest()
    {
        Provider.Setup(p => p.Get("trackerId")).Returns("123");
        EvaluateAndExpect("Cookies.Get('trackerId')", "123");
    }

    [Fact]
    public void SetSessionTest()
    {
        Execute("Cookies.SetSession('trackerId', '123')");
        Provider.Verify(p => p.SetSession("trackerId", "123"));
    }

    [Fact]
    public void SetPersistentTest()
    {
        Execute("Cookies.SetPersistent('trackerId', '123', 666)");
        Provider.Verify(p => p.SetPersistent("trackerId", "123", 666));
    }

    [Fact]
    public void DeleteTest()
    {
        Execute("Cookies.Delete('trackerId')");
        Provider.Verify(p => p.Delete("trackerId"));
    }

    [Fact]
    public void SetTest()
    {
        Execute("Cookies.Set('trackerId', '123', 66, TRUE, 'Label', '/page')");
        Provider.Verify(p => p.Set("trackerId", "123", 66, true, "Label", "/page"));
    }
}
