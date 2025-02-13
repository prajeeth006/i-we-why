using FluentAssertions;
using Frontend.SharedFeatures.Api.Features.ResponsibleGaming;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Services.ResponsibleGaming;
using Frontend.Vanilla.ServiceClients.Services.ResponsibleGaming.PlayerLimits;
using Frontend.Vanilla.Testing.Fakes;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace Frontend.SharedFeatures.Api.Tests.Features.ResponsibleGaming;

public class PlayerLimitsControllerTests
{
    private readonly PlayerLimitsController target;
    private readonly Mock<IPosApiResponsibleGamingServiceInternal> posApiResponsibleGamingServiceMock;
    private readonly TestLogger<PlayerLimitsController> log;

    private readonly CancellationToken cancellationToken;

    public PlayerLimitsControllerTests()
    {
        posApiResponsibleGamingServiceMock = new Mock<IPosApiResponsibleGamingServiceInternal>();
        log = new TestLogger<PlayerLimitsController>();
        cancellationToken = TestCancellationToken.Get();

        target = new PlayerLimitsController(posApiResponsibleGamingServiceMock.Object, log);
    }

    [Fact]
    public async Task Get_ShouldReturnPlayerLimitsResponse()
    {
        // Setup
        var response = new PlayerLimits
        {
            Limits = new List<Limit>
            {
                new Limit() { LimitType = "Single", CurrentLimit = 1 },
            },
        };
        posApiResponsibleGamingServiceMock.Setup(s => s.GetPlayerLimitsAsync(cancellationToken)).ReturnsAsync(response);

        // Act
        var result = (OkObjectResult)await target.Get(cancellationToken);
        var limitsResponse = new { limits = response.Limits.Select(limit => new { limit.LimitType, limit.CurrentLimit }) };

        // Assert
        result.Value.Should().BeEquivalentTo(limitsResponse);
    }

    [Fact]
    public async Task Get_ShouldReturnBadRequest_OnPosApiException()
    {
        // Setup
        var exception = new PosApiException(message: "error", posApiCode: 500);
        posApiResponsibleGamingServiceMock.Setup(s => s.GetPlayerLimitsAsync(cancellationToken)).ThrowsAsync(exception);

        // Act
        var result = await target.Get(cancellationToken);

        // Assert
        result.Should().BeOfType<BadRequestObjectResult>();
        log.Logged.Single().Verify(LogLevel.Error, exception);
    }
}
