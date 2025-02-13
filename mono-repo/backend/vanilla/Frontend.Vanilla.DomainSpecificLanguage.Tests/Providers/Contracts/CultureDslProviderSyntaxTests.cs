using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Xunit;

namespace Frontend.Vanilla.DomainSpecificLanguage.Tests.Providers.Contracts;

public class CultureDslProviderSyntaxTests : SyntaxTestBase<ICultureDslProvider>
{
    [Fact]
    public void Default_Test()
    {
        Provider.SetupGet(p => p.Default).Returns("wtf-11");
        EvaluateAndExpect("Culture.Default", "wtf-11");
    }

    [Fact]
    public void Allowed_Test()
    {
        Provider.Setup(p => p.GetAllowed()).Returns("omg-11, lol-22");
        EvaluateAndExpect("Culture.Allowed", "omg-11, lol-22");
    }

    [Fact]
    public void Current_Test()
    {
        Provider.SetupGet(p => p.Current).Returns("wtf-22");
        EvaluateAndExpect("Culture.Current", "wtf-22");
    }

    [Fact]
    public void FromClaims_Test()
    {
        Provider.Setup(p => p.GetFromClaims()).Returns("wtf-33");
        EvaluateAndExpect("Culture.FromClaims", "wtf-33");
    }

    [Fact]
    public void FromBrowser_Test()
    {
        Provider.Setup(p => p.GetFromBrowser()).Returns("wtf-44");
        EvaluateAndExpect("Culture.FromBrowser", "wtf-44");
    }

    [Fact]
    public void FromPreviousVisit_Test()
    {
        Provider.Setup(p => p.GetFromPreviousVisit()).Returns("wtf-55");
        EvaluateAndExpect("Culture.FromPreviousVisit", "wtf-55");
    }

    [Fact]
    public void GetUrlToken_Test()
    {
        Provider.Setup(p => p.GetUrlToken("wtf-44")).Returns("lol");
        EvaluateAndExpect("Culture.GetUrlToken('wtf-44')", "lol");
    }
}
