using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Moq;
using Xunit;

namespace Frontend.Vanilla.DomainSpecificLanguage.Tests.Providers.Contracts;

public sealed class BrowserDslProviderSyntaxTests : SyntaxTestBase<IBrowserDslProvider>
{
    [Fact]
    public void Name_Test()
    {
        Provider.Setup(p => p.GetNameAsync(Mode)).ReturnsAsync("Netscape Navigator");
        EvaluateAndExpect("Browser.Name", "Netscape Navigator");
    }

    [Fact]
    public void VersionTest()
    {
        Provider.Setup(p => p.GetVersionAsync(Mode)).ReturnsAsync("6.6.6");
        EvaluateAndExpect("Browser.Version", "6.6.6");
    }

    [Fact]
    public void MajorVersionTest()
    {
        Provider.Setup(p => p.GetMajorVersionAsync(Mode)).ReturnsAsync(42m);
        EvaluateAndExpect("Browser.MajorVersion", 42m);
    }

    [Fact]
    public void StandaloneAppTest()
    {
        ShouldBeCompilable<bool>("Browser.IsStandaloneApp");
    }
}
