using System;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Frontend.Vanilla.Features.DeviceAtlas;
using Frontend.Vanilla.Features.DslProviders;
using Frontend.Vanilla.Testing.Fakes;
using Frontend.Vanilla.Testing.FluentAssertions;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.DslProviders;

public sealed class BrowserDslProviderTests
{
    private IBrowserDslProvider target;
    private Mock<IDeviceDslProvider> deviceCapabilities;
    private readonly ExecutionMode mode;

    public BrowserDslProviderTests()
    {
        mode = TestExecutionMode.Get();
        deviceCapabilities = new Mock<IDeviceDslProvider>();
        target = new BrowserDslProvider(deviceCapabilities.Object);
    }

    [Fact]
    public async Task Name_ShouldGetItFromCapabilities()
    {
        deviceCapabilities.Setup(r => r.GetCapabilityAsync(mode, "browserName")).ReturnsAsync("Edge");
        (await target.GetNameAsync(mode)).Should().Be("Edge"); // Act
    }

    [Fact]
    public async Task Version_ShouldGetItFromCapabilities()
    {
        deviceCapabilities.Setup(r => r.GetCapabilityAsync(mode, "browserVersion")).ReturnsAsync("1.2.3");
        (await target.GetVersionAsync(mode)).Should().Be("1.2.3"); // Act
    }

    [Theory]
    [InlineData("1.2.3", 1)]
    [InlineData("22.3.4", 22)]
    [InlineData("2.3.4.4", 2)]
    public async Task MajorVersion_ShouldGetItFromCapabilities(string version, int expectedMajorVersion)
    {
        deviceCapabilities.Setup(r => r.GetCapabilityAsync(mode, "browserVersion")).ReturnsAsync(version);
        (await target.GetMajorVersionAsync(mode)).Should().Be(expectedMajorVersion); // Act
    }

    [Theory]
    [InlineData("17x.4.3.2")]
    [InlineData("o22.3.4")]
    [InlineData("z.3.4.4")]
    public async Task MajorVersionAsync_ShouldThrowWhenInvalidValue(string invalidVersion)
    {
        deviceCapabilities.Setup(r => r.GetCapabilityAsync(mode, "browserVersion")).ReturnsAsync(invalidVersion);

        Func<Task> act = async () => await target.GetMajorVersionAsync(mode); // Act

        var exception = await act.Should().ThrowAsync<Exception>();
        exception.Which.Message.Should().Be($"Failed to parse major version from {invalidVersion}. This value comes from DeviceAtlas api.");
    }
}
