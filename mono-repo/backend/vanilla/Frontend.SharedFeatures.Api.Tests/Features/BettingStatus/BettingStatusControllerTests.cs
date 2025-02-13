using FluentAssertions;
using Frontend.SharedFeatures.Api.Features.BettingStatus;
using Frontend.Vanilla.ServiceClients.Services.MyBets;
using Frontend.Vanilla.Testing.Fakes;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace Frontend.SharedFeatures.Api.Tests.Features.BettingStatus;

public class BettingStatusControllerTests
{
    private readonly BettingStatusController target;
    private readonly Mock<IPosApiMyBetsService> posApiMyBetsService;
    private readonly TestLogger<BettingStatusController> log;
    private readonly CancellationToken ct;

    public BettingStatusControllerTests()
    {
        posApiMyBetsService = new Mock<IPosApiMyBetsService>();
        log = new TestLogger<BettingStatusController>();
        ct = TestCancellationToken.Get();

        target = new BettingStatusController(posApiMyBetsService.Object, log);

        posApiMyBetsService.Setup(s => s.GetAsync(ct, It.IsAny<bool>())).ReturnsAsync(true);
    }

    [Fact]
    public async Task Get_ShouldReturnCorrectValue()
    {
        // Act
        var result = (OkObjectResult)await target.Get(ct);

        // Asset
        result.Value.Should().BeEquivalentTo(new { hasBets = true });
    }

    [Fact]
    public async Task Get_ShouldReturnTechnicalError_OnGeneralException()
    {
        // Setup
        var exception = new Exception(message: "error");
        posApiMyBetsService.Setup(s => s.GetAsync(ct, It.IsAny<bool>())).ThrowsAsync(exception);

        // Act
        var result = await target.Get(ct);

        // Assert
        result.Should().BeOfType<BadRequestObjectResult>();
        log.Logged.Single().Verify(LogLevel.Error, exception);
    }
}
