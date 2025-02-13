using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.DomainSpecificLanguage;
using Frontend.Vanilla.Features.NativeApp;
using Frontend.Vanilla.Testing.AbstractTests;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.NativeApp;

public class NativeAppClientConfigProviderTests : ClientConfigProviderTestsBase
{
    private Mock<INativeAppService> nativeAppService;
    private Mock<INativeAppConfiguration> nativeAppSettingsConfiguration;

    public NativeAppClientConfigProviderTests()
    {
        nativeAppService = new Mock<INativeAppService>();
        nativeAppSettingsConfiguration = new Mock<INativeAppConfiguration>();

        Target = new NativeAppClientConfigProvider(nativeAppService.Object, nativeAppSettingsConfiguration.Object);
    }

    [Fact]
    public void ShouldHaveCorrectName()
    {
        Target.Name.Should().Be("vnNativeApp");
    }

    [Fact]
    public async Task ShouldReturnNativeAppSettingsForNativeApp()
    {
        var details = new NativeAppDetails("sports-wrapper", "sports", NativeAppMode.Wrapper.ToString());
        nativeAppService.Setup(s => s.GetCurrentDetails()).Returns(details);
        var appsFlyerDsl = new Mock<IDslExpression<bool>>();
        appsFlyerDsl.Setup(d => d.EvaluateAsync(It.IsAny<CancellationToken>())).ReturnsAsync(true);

        nativeAppSettingsConfiguration.SetupGet(c => c.EnableWrapperEmulator).Returns(true);
        nativeAppSettingsConfiguration.SetupGet(c => c.EnableAppsFlyerFilterValue).Returns(appsFlyerDsl.Object);
        nativeAppSettingsConfiguration.SetupGet(c => c.DisabledEvents).Returns(new[] { "ccb_test1", "ccb_test2" });
        nativeAppSettingsConfiguration.SetupGet(c => c.EnableCcbTracing).Returns(true);
        nativeAppSettingsConfiguration.SetupGet(c => c.HtcmdSchemeEnabled).Returns(true);
        nativeAppSettingsConfiguration.SetupGet(c => c.TracingBlacklistPattern).Returns("remove");

        var config = await Target_GetConfigAsync();

        config["applicationName"].Should().BeEquivalentTo(details.ApplicationName);
        config["product"].Should().BeEquivalentTo(details.Product);
        config["nativeMode"].ToString().Should().BeEquivalentTo(NativeAppMode.Wrapper.ToString());
        config["isNative"].Should().Be(true);
        config["isNativeApp"].Should().Be(false);
        config["isNativeWrapper"].Should().Be(true);
        config["isTerminal"].Should().Be(false);
        config["enableAppsFlyer"].Should().Be(true);
        config["enableWrapperEmulator"].Should().Be(true);
        config["enableCCBTracing"].Should().Be(true);
        config["tracingBlacklistPattern"].Should().Be("remove");
        config["htcmdSchemeEnabled"].Should().Be(true);
    }
}
