using FluentAssertions;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Frontend.Vanilla.Features.DslProviders;
using Frontend.Vanilla.Features.NativeApp;
using Frontend.Vanilla.Testing.Xunit;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.DslProviders;

public class NativeApplicationDslProviderTests
{
    private readonly INativeApplicationDslProvider target;
    private readonly Mock<INativeAppService> nativeAppService;

    public NativeApplicationDslProviderTests()
    {
        nativeAppService = new Mock<INativeAppService>();
        target = new NativeApplicationDslProvider(nativeAppService.Object);
    }

    [Theory, ValuesData(NativeAppMode.DownloadClient, NativeAppMode.DownloadClientWrapper, NativeAppMode.Native, NativeAppMode.Unknown, NativeAppMode.Wrapper)]
    public void ShouldReturnNativeProperties(NativeAppMode mode)
    {
        var details = new NativeAppDetails("app", "product", mode.ToString());
        nativeAppService.Setup(s => s.GetCurrentDetails()).Returns(details);

        // Act & assert
        target.IsNative().Should().Be(details.IsNative);
        target.IsNativeApp().Should().Be(details.IsNativeApp);
        target.IsNativeWrapper().Should().Be(details.IsNativeWrapper);
        target.IsDownloadClient().Should().Be(details.IsDownloadClient);
        target.IsDownloadClientApp().Should().Be(details.IsDownloadClientApp);
        target.IsDownloadClientWrapper().Should().Be(details.IsDownloadClientWrapper);
        target.IsTerminal().Should().Be(details.IsTerminal);
        target.GetProduct().Should().Be("PRODUCT");
        target.GetName().Should().Be("app");
    }
}
