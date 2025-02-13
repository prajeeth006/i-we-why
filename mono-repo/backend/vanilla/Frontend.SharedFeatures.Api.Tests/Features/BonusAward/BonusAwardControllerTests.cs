using FluentAssertions;
using Frontend.SharedFeatures.Api.Features.BonusAward;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Services.Promohub;
using Frontend.Vanilla.ServiceClients.Services.Promohub.BonusAward;
using Frontend.Vanilla.Testing.Fakes;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace Frontend.SharedFeatures.Api.Tests.Features.BonusAward;

public class BonusAwardControllerTests
{
    private readonly BonusAwardController target;
    private readonly Mock<IPosApiPromohubServiceInternal> posApiPromohubServiceMock;
    private readonly TestLogger<BonusAwardController> log;
    private readonly CancellationToken ct;
    private readonly ExecutionMode mode;

    public BonusAwardControllerTests()
    {
        posApiPromohubServiceMock = new Mock<IPosApiPromohubServiceInternal>();
        log = new TestLogger<BonusAwardController>();
        target = new BonusAwardController(posApiPromohubServiceMock.Object, log);

        ct = new CancellationTokenSource().Token;
        mode = TestExecutionMode.Get();
    }

    [Fact]
    public async Task Get_ShouldReturnBonusAwardResponse()
    {
        // Setup
        var bonus = new BonusAwardResponse(new IssuedBonus(true));
        posApiPromohubServiceMock.Setup(x => x.GetBonusAwardAsync(It.IsAny<ExecutionMode>(), "12")).ReturnsAsync(bonus);

        // Act
        var result = (OkObjectResult)await target.Get("12", ct);

        // Assert
        result.Value.Should().BeEquivalentTo(new
        {
            isBonusAwarded = true,
        });
    }

    [Fact]
    public async Task Get_ShouldLogError_And_ReturnOk_OnPosApiException()
    {
        // Setup
        var exception = new PosApiException(message: "error", posApiCode: 102, posApiMessage: "pos api error");
        posApiPromohubServiceMock.Setup(x => x.GetBonusAwardAsync(It.IsAny<ExecutionMode>(), "12")).ThrowsAsync(exception);

        // Act
        var result = await target.Get("12", ct);

        // Assert
        result.Should().BeOfType<BadRequestObjectResult>();
        log.Logged.Single().Verify(LogLevel.Error, exception);
    }

    [Fact]
    public async Task Get_ShouldLogError_OnGeneralException()
    {
        // Setup
        var exception = new Exception(message: "error");
        posApiPromohubServiceMock.Setup(x => x.GetBonusAwardAsync(It.IsAny<ExecutionMode>(), "12")).ThrowsAsync(exception);

        // Act
        var result = await target.Get("12", ct);

        // Assert
        result.Should().BeOfType<BadRequestObjectResult>();
        log.Logged.Single().Verify(LogLevel.Error, exception);
    }
}
