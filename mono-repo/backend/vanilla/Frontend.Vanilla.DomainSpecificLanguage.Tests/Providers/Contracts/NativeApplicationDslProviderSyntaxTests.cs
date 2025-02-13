using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Frontend.Vanilla.Testing.Xunit;
using Xunit;

namespace Frontend.Vanilla.DomainSpecificLanguage.Tests.Providers.Contracts;

public sealed class NativeApplicationDslProviderSyntaxTests : SyntaxTestBase<INativeApplicationDslProvider>
{
    [Theory, BooleanData]
    public void IsNativeAppTest(bool isNative)
    {
        Provider.Setup(p => p.IsNativeApp()).Returns(isNative);
        EvaluateAndExpect("NativeApplication.IsNativeApp", isNative);
    }

    [Theory, BooleanData]
    public void IsNativeWrapperTest(bool isNative)
    {
        Provider.Setup(p => p.IsNativeWrapper()).Returns(isNative);
        EvaluateAndExpect("NativeApplication.IsNativeWrapper", isNative);
    }

    [Theory, BooleanData]
    public void IsDownloadClientTest(bool isNative)
    {
        Provider.Setup(p => p.IsDownloadClient()).Returns(isNative);
        EvaluateAndExpect("NativeApplication.IsDownloadClient", isNative);
    }

    [Theory, BooleanData]
    public void IsDownloadClientAppTest(bool isNative)
    {
        Provider.Setup(p => p.IsDownloadClientApp()).Returns(isNative);
        EvaluateAndExpect("NativeApplication.IsDownloadClientApp", isNative);
    }

    [Theory, BooleanData]
    public void IsDownloadClientWrapperTest(bool isNative)
    {
        Provider.Setup(p => p.IsDownloadClientWrapper()).Returns(isNative);
        EvaluateAndExpect("NativeApplication.IsDownloadClientWrapper", isNative);
    }

    [Theory, BooleanData]
    public void IsTerminalTest(bool isTerminal)
    {
        Provider.Setup(p => p.IsTerminal()).Returns(isTerminal);
        EvaluateAndExpect("NativeApplication.IsTerminal", isTerminal);
    }

    [Theory, BooleanData]
    public void IsNativeTest(bool isNative)
    {
        Provider.Setup(p => p.IsNative()).Returns(isNative);
        EvaluateAndExpect("NativeApplication.IsNative", isNative);
    }

    [Fact]
    public void ProductTest()
    {
        Provider.Setup(p => p.GetProduct()).Returns("Sports");
        EvaluateAndExpect("NativeApplication.Product", "Sports");
    }

    [Fact]
    public void NameTest()
    {
        Provider.Setup(p => p.GetName()).Returns("LiveSports");
        EvaluateAndExpect("NativeApplication.Name", "LiveSports");
    }
}
