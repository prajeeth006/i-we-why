using FluentAssertions;
using Frontend.Host.Features.ClientApp;
using Frontend.Vanilla.Core.Reflection;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace Frontend.Host.Tests.Features.ClientApp;

public class ClientAppHealthCheckTests
{
    private readonly Mock<IClientAppService> serviceMock;
    private readonly Mock<ILogger<ClientAppHealthCheck>> loggerMock;
    private readonly ClientAppHealthCheck target;
    private readonly VanillaVersion version;

    public ClientAppHealthCheckTests()
    {
        serviceMock = new Mock<IClientAppService>();
        version = new VanillaVersion(1, 2, 3, 4, "dev");
        loggerMock = new Mock<ILogger<ClientAppHealthCheck>>();
        target = new ClientAppHealthCheck(serviceMock.Object, version, loggerMock.Object);
    }

    [Fact]
    public async Task ExecuteAsync_SuccessfulResponse_ReturnsSuccessResult()
    {
        var currentVersion = new Version(1, 2, 3, 4);
        var availableVersions = new List<Version>
            { new Version(1, 0, 0, 0), new Version(1, 1, 3, 3), new Version(1, 2, 3, 4) };
        serviceMock.Setup(s => s.GetCurrentVersionAsync(It.IsAny<CancellationToken>())).ReturnsAsync(currentVersion);
        serviceMock.Setup(s => s.GetAvailableVersionsAsync(It.IsAny<CancellationToken>())).ReturnsAsync(availableVersions);
        // Act
        var result = await target.ExecuteAsync(CancellationToken.None);

        // Assert
        var details = result.Details! as dynamic;
        (details.currentVersion as Version).Should().Be(currentVersion);
        (details.vanillaVersion as VanillaVersion).Should().Be(version);
        (details.availableVersions as List<Version>).Should().BeEquivalentTo(availableVersions);
    }

    [Fact]
    public async Task ExecuteAsync_ExceptionThrown_ReturnsFailedResult()
    {
        // Arrange
        serviceMock.Setup(factory => factory.GetCurrentVersionAsync(It.IsAny<CancellationToken>()))
            .ThrowsAsync(new Exception());

        // Act
        var result = await target.ExecuteAsync(CancellationToken.None);

        // Assert
        result.Error.Should().Be("Failed to execute client app health check.");
    }
}
