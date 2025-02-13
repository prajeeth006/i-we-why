using System.Collections.Generic;
using FluentAssertions;
using Frontend.Vanilla.Features.Cookies;
using Frontend.Vanilla.Features.NativeApp;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.NativeApp;

public class NativeAppServiceTests
{
    private INativeAppService target;
    private Mock<ICookieHandler> cookieHandler;
    private Mock<INativeAppConfiguration> nativeAppConfig;

    public NativeAppServiceTests()
    {
        cookieHandler = new Mock<ICookieHandler>();
        nativeAppConfig = new Mock<INativeAppConfiguration>();
        target = new NativeAppService(nativeAppConfig.Object, cookieHandler.Object);

        nativeAppConfig.SetupGet(n => n.Apps).Returns(
            new Dictionary<string, NativeAppConfigurationRecord>
            {
                ["sports"] = new NativeAppConfigurationRecord("sportsbook", NativeAppMode.Native.ToString()),
                ["casino"] = new NativeAppConfigurationRecord("casino", NativeAppMode.Native.ToString()),
                ["livecasino"] = new NativeAppConfigurationRecord("casino", NativeAppMode.Wrapper.ToString()),
            });
    }

    [Theory]
    [InlineData("sports", "sports", "SPORTSBOOK", NativeAppMode.Native)]
    [InlineData("casino", "casino", "CASINO", NativeAppMode.Native)]
    [InlineData("livecasino", "livecasino", "CASINO", NativeAppMode.Wrapper)]
    [InlineData("gibberish", "unknown", "UNKNOWN", NativeAppMode.Unknown)]
    [InlineData(null, "unknown", "UNKNOWN", NativeAppMode.Unknown)]
    public void ShouldInitializeValuesBasedOnConfiguration(
        string requestValue,
        string expectedAppName,
        string expectedProduct,
        NativeAppMode expectedMode)
    {
        cookieHandler.Setup(r => r.GetValue(NativeAppConstants.CookieName)).Returns(requestValue);

        var details = target.GetCurrentDetails(); // Act

        details.ApplicationName.Should().Be(expectedAppName);
        details.Product.Should().Be(expectedProduct);
        details.NativeMode.Should().Be(expectedMode);
        details.Product.Should().Be(expectedProduct);
        details.ApplicationName.Should().Be(expectedAppName);
        details.IsNative.Should().Be(expectedMode != NativeAppMode.Unknown);
        details.IsNativeApp.Should().Be(expectedMode == NativeAppMode.Native);
        details.IsNativeWrapper.Should().Be(expectedMode == NativeAppMode.Wrapper);
    }
}
