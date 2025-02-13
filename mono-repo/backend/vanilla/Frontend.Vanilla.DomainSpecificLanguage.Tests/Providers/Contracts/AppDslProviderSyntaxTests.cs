using System;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Frontend.Vanilla.Testing.Xunit;
using Moq;
using Xunit;

namespace Frontend.Vanilla.DomainSpecificLanguage.Tests.Providers.Contracts;

public sealed class AppDslProviderSyntaxTests : SyntaxTestBase<IAppDslProvider>
{
    [Fact]
    public void Environment_Test()
    {
        Provider.Setup(p => p.Environment).Returns("inferno");
        EvaluateAndExpect("App.Environment", "inferno");
    }

    [Theory, BooleanData]
    public void IsProduction_Test(bool value)
    {
        Provider.Setup(p => p.IsProduction).Returns(value);
        EvaluateAndExpect("App.IsProduction", value);
    }

    [Fact]
    public void Label_Test()
    {
        Provider.Setup(p => p.Label).Returns("bwin.inf");
        EvaluateAndExpect("App.Label", "bwin.inf");
    }

    [Fact]
    public void Product_Test()
    {
        Provider.Setup(p => p.Product).Returns("horses");
        EvaluateAndExpect("App.Product", "horses");
    }

    [Fact]
    [Obsolete]
    public void DefaultCulture_Test()
    {
        Provider.Setup(p => p.DefaultCulture).Returns("en-US");
        EvaluateAndExpect("App.DefaultCulture", "en-US");
    }

    [Fact]
    [Obsolete]
    public void DefaultCultureToken_Test()
    {
        Provider.Setup(p => p.DefaultCultureToken).Returns("en");
        EvaluateAndExpect("App.DefaultCultureToken", "en");
    }

    [Fact]
    public void ContextTest()
    {
        Provider.Setup(p => p.Context()).Returns("iframe");
        EvaluateAndExpect("App.Context", "iframe");
    }

    [Fact]
    public void ThemeTest()
    {
        Provider.SetupGet(p => p.Theme).Returns("black");
        EvaluateAndExpect("App.Theme", "black");
    }

    [Fact]
    public void PlatformProductNameTest()
    {
        Provider.Setup(p => p.GetPlatformProductNameAsync(Mode)).ReturnsAsync("sportsbook");
        EvaluateAndExpect("App.PlatformProductName", "sportsbook");
    }
}
