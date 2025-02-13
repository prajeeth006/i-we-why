using System.Collections.Generic;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Frontend.Vanilla.Features.Device;
using Frontend.Vanilla.Features.DeviceAtlas;
using Frontend.Vanilla.Testing;
using Frontend.Vanilla.Testing.AbstractTests;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.Device;

public class DeviceClientConfigProviderTests : ClientConfigProviderTestsBase
{
    private readonly Mock<IDeviceDslProvider> deviceCapabilities;
    private readonly Mock<IDeviceAtlasService> deviceAtlasService;
    private readonly Mock<IDeviceLoggingConfiguration> deviceLoggingConfig;
    private readonly ExecutionMode mode;

    public DeviceClientConfigProviderTests()
    {
        mode = ExecutionMode.Async(Ct);
        deviceCapabilities = new Mock<IDeviceDslProvider>();
        deviceAtlasService = new Mock<IDeviceAtlasService>();
        deviceLoggingConfig = new Mock<IDeviceLoggingConfiguration>();
        Target = new DeviceClientConfigProvider(deviceCapabilities.Object, deviceAtlasService.Object, deviceLoggingConfig.Object);
    }

    public static IEnumerable<object[]> TestCases => TestValues.Booleans.ToTestCases()
        .CombineWith(TestValues.Booleans)
        .CombineWith(TestValues.Booleans)
        .CombineWith(TestValues.Booleans)
        .CombineWith(TestValues.Booleans)
        .CombineWith(TestValues.Booleans)
        .CombineWith(TestValues.Booleans)
        .CombineWith(TestValues.Booleans);

    [Theory, MemberData(nameof(TestCases))]
    public async Task GetClientConfiguration_ReturnDeviceInformation(
        bool isMobile,
        bool isMobilePhone,
        bool isTablet,
        bool isTouch,
        bool isAndroid,
        bool isIos,
        bool isRobot,
        bool logInfoEnabled)
    {
        deviceCapabilities.Setup(p => p.IsMobileAsync(mode)).ReturnsAsync(isMobile);
        deviceCapabilities.Setup(p => p.IsIOSAsync(mode)).ReturnsAsync(isIos);
        deviceCapabilities.Setup(p => p.IsAndroidAsync(mode)).ReturnsAsync(isAndroid);
        deviceCapabilities.Setup(p => p.IsMobilePhoneAsync(mode)).ReturnsAsync(isMobilePhone);
        deviceCapabilities.Setup(p => p.IsTabletAsync(mode)).ReturnsAsync(isTablet);
        deviceCapabilities.Setup(p => p.IsTouchAsync(mode)).ReturnsAsync(isTouch);
        deviceCapabilities.Setup(p => p.IsRobotAsync(mode)).ReturnsAsync(isRobot);
        deviceCapabilities.Setup(p => p.ModelAsync(mode)).ReturnsAsync("Pixel 66");
        deviceCapabilities.Setup(p => p.OSNameAsync(mode)).ReturnsAsync("namee");
        deviceCapabilities.Setup(p => p.OSVersionAsync(mode)).ReturnsAsync("versionn");
        deviceCapabilities.Setup(p => p.VendorAsync(mode)).ReturnsAsync("Pvendor");
        deviceCapabilities.Setup(o => o.GetCapabilityAsync(mode, It.IsAny<string>())).ReturnsAsync((ExecutionMode mode, string x) => x);
        deviceAtlasService.Setup(o => o.GetAsync(mode)).ReturnsAsync((true, new Dictionary<string, string>
        {
            { "test", "test1" },
        }));
        deviceLoggingConfig.SetupGet(l => l.IsEnabled).Returns(logInfoEnabled);

        var config = await Target_GetConfigAsync(); // Act

        config.Should().BeEquivalentTo(new Dictionary<string, object>
        {
            { "isAndroid", isAndroid },
            { "isMobile", isMobile },
            { "isios", isIos },
            { "isMobilePhone", isMobilePhone },
            { "isTablet", isTablet },
            { "isTouch", isTouch },
            { "isRobot", isRobot },
            { "model", "Pixel 66" },
            { "osName", "namee" },
            { "osVersion", "versionn" },
            { "vendor", "Pvendor" },
            { "cpuMaxFrequency", "cpuMaxFrequency" },
            { "totalRam", "totalRam" },
            { "cpuCores", "cpuCores" },
            { "displayWidth", "displayWidth" },
            { "displayHeight", "displayHeight" },
            { "logInfoEnabled", logInfoEnabled },
            { "properties", new Dictionary<string, string> { { "test", "test1" }, } },
        });
    }
}
