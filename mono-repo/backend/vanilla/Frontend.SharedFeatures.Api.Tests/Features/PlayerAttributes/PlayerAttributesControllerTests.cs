using FluentAssertions;
using Frontend.SharedFeatures.Api.Features.PlayerAttributes;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Features.Json.ActionResults;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Services.Crm;
using Frontend.Vanilla.ServiceClients.Services.Crm.PlayerAttributes;
using Frontend.Vanilla.Testing.Fakes;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace Frontend.SharedFeatures.Api.Tests.Features.PlayerAttributes;

public class PlayerAttributesControllerTests
{
    private readonly PlayerAttributesController target;
    private readonly Mock<IPosApiCrmServiceInternal> posApiCrmServiceInternalMock;
    private readonly TestLogger<PlayerAttributesController> log;
    private readonly CancellationToken ct;
    private readonly ExecutionMode mode;

    public PlayerAttributesControllerTests()
    {
        posApiCrmServiceInternalMock = new Mock<IPosApiCrmServiceInternal>();
        log = new TestLogger<PlayerAttributesController>();
        ct = new CancellationTokenSource().Token;
        mode = ExecutionMode.Async(ct);

        target = new PlayerAttributesController(posApiCrmServiceInternalMock.Object, log);
    }

    [Fact]
    public async Task Get_ShouldReturnResult()
    {
        // Setup
        var response = new PlayerAttributesDto(attributes: new Attributes());

        posApiCrmServiceInternalMock.Setup(s => s.GetPlayerAttributesAsync(mode, It.IsAny<bool>()))
            .ReturnsAsync(response);

        // Act
        var result = (OkObjectResult)await target.Get(ct);

        // Assert
        result.Value.Should().BeEquivalentTo(response.Attributes);
    }

    [Fact]
    public async Task Get_ShouldLogError_OnException()
    {
        // Setup
        var exception = new PosApiException(message: "error", posApiCode: 500);
        posApiCrmServiceInternalMock.Setup(s => s.GetPlayerAttributesAsync(mode, It.IsAny<bool>())).ThrowsAsync(exception);

        // Act
        var result = await target.Get(ct);

        // Assert
        result.Should().BeOfType<TechnicalErrorMessageResult>();
        log.Logged.Single().Verify(LogLevel.Error, exception);
    }
}
