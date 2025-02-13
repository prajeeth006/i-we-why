using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.Diagnostics.Health;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Features.DeviceAtlas;
using Frontend.Vanilla.Testing.Fakes;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.DeviceAtlas;

public class DeviceAtlasHealthCheckTests
{
    private IHealthCheck target;
    private Mock<IDeviceAtlasService> service;
    private readonly CancellationToken ct;
    private readonly ExecutionMode mode;

    public DeviceAtlasHealthCheckTests()
    {
        ct = TestCancellationToken.Get();
        mode = ExecutionMode.Async(ct);
        service = new Mock<IDeviceAtlasService>();
        target = new DeviceAtlasHealthCheck(service.Object);
    }

    [Fact]
    public void Metadata_ShouldBeSet()
        => target.Metadata.Should().NotBeNull().And.BeSameAs(target.Metadata, "singleton");

    [Fact]
    public async Task ExecuteAsync_ShouldReturnFailedHealthCheckResult()
    {
        var data = new Dictionary<string, string>();
        // Arrange
        service.Setup(s => s.GetAsync(mode)).ReturnsAsync((false, data));

        // Act
        var result = await target.ExecuteAsync(ct);

        // Assert
        result.Details.Should().BeNull();
        result.Error.Should().Be("Failed to execute device atlas health check.");
    }

    [Fact]
    public async Task ExecuteAsync_ShouldReturnSuccessfulHealthCheckResult_WhenSuccessfull()
    {
        var data = new Dictionary<string, string> { ["IsMobile"] = "1" };
        // Arrange
        service.Setup(s => s.GetAsync(mode)).ReturnsAsync((true, data));

        // Act
        var result = await target.ExecuteAsync(ct);

        // Assert
        result.Details.Should().Be(data);
        result.Error.Should().BeNull();
    }
}
