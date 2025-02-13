using FluentAssertions;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Frontend.Vanilla.Features.DynaConVariationContext.Providers;
using Frontend.Vanilla.Testing;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.DynaConVariationContext.Providers;

public sealed class DeviceTypeDynaConProviderTests : DynaConProviderTestsBase
{
    private Mock<IDeviceDslProvider> deviceDslProvider;

    public DeviceTypeDynaConProviderTests()
    {
        deviceDslProvider = new Mock<IDeviceDslProvider>();
        Target = new DeviceTypeDynaConProvider(deviceDslProvider.Object);
    }

    [Theory]
    [InlineData(false, false, DeviceTypes.Desktop)]
    [InlineData(true, false, DeviceTypes.Phone)]
    [InlineData(true, true, DeviceTypes.Tablet)]
    public void GetCurrentValue_Test(bool isMobile, bool isTablet, string expected)
    {
        deviceDslProvider.Setup(p => p.IsMobileAsync(It.IsAny<ExecutionMode>())).ReturnsAsync(isMobile);
        deviceDslProvider.Setup(p => p.IsTabletAsync(It.IsAny<ExecutionMode>())).ReturnsAsync(isTablet);

        var result = Target.GetCurrentRawValue(); // Act

        result.Should().Be(expected);
    }
}
