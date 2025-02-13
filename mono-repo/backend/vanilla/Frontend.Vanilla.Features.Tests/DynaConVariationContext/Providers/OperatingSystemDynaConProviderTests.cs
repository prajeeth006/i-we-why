using System.Collections.Generic;
using FluentAssertions;
using Frontend.Vanilla.Features.DeviceAtlas;
using Frontend.Vanilla.Features.DynaConVariationContext.Providers;
using Frontend.Vanilla.Testing;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.DynaConVariationContext.Providers;

public class OperatingSystemDynaConProviderTests : DynaConProviderTestsBase
{
    private readonly Mock<IDeviceAtlasService> deviceAtlasService;

    public OperatingSystemDynaConProviderTests()
    {
        deviceAtlasService = new Mock<IDeviceAtlasService>();
        Target = new OperatingSystemDynaConProvider(deviceAtlasService.Object);
    }

    [Fact]
    public void GetCurrentRawValue_ShouldGetOS()
    {
        deviceAtlasService.Setup(p => p.Get()).Returns((true, new Dictionary<string, string> { ["osName"] = "linux" }));
        Target.GetCurrentRawValue().Should().Be("linux");
    }

    [Fact]
    public void GetCurrentRawValue_ShouldGetDefaultValue()
    {
        deviceAtlasService.Setup(p => p.Get()).Returns((true, new Dictionary<string, string> { ["isRobot"] = "1" }));
        Target.GetCurrentRawValue().Should().Be(Target.DefaultValue);
    }
}
