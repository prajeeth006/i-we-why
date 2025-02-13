using FluentAssertions;
using Frontend.SharedFeatures.Api.Features.AbuserInformation;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Features.AbuserInformation;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Services.Account;
using Frontend.Vanilla.ServiceClients.Services.Account.AbuserInformation;
using Frontend.Vanilla.Testing.Fakes;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace Frontend.SharedFeatures.Api.Tests.Features.AbuserInformation;

public class AbuserInformationControllerTests
{
    private readonly AbuserInformationController target;
    private readonly Mock<IPosApiAccountServiceInternal> posApiRetailServiceMock;
    private readonly TestLogger<AbuserInformationController> log;
    private readonly CancellationToken ct;

    public AbuserInformationControllerTests()
    {
        posApiRetailServiceMock = new Mock<IPosApiAccountServiceInternal>();
        log = new TestLogger<AbuserInformationController>();
        target = new AbuserInformationController(posApiRetailServiceMock.Object, log);

        ct = new CancellationTokenSource().Token;
    }

    [Fact]
    public async Task Get_ShouldReturnAbuserInformationResponse()
    {
        // Setup
        var response = new BonusAbuserInformationResponse(isBonusAbuser: true);
        posApiRetailServiceMock.Setup(s => s.GetDnaAbuserInformationAsync(ExecutionMode.Async(ct)))
            .ReturnsAsync(response);

        // Act
        var result = (OkObjectResult)await target.Get(ct);

        // Assert
        result.Value.Should().BeEquivalentTo(new AbuserInformationResponse(true));
    }

    [Fact]
    public async Task Get_ShouldLogError_OnPosApiException()
    {
        // Setup
        var exception = new PosApiException(message: "error", posApiCode: 500);
        posApiRetailServiceMock.Setup(s => s.GetDnaAbuserInformationAsync(ExecutionMode.Async(ct))).ThrowsAsync(exception);

        // Act
        var result = await target.Get(ct);

        // Assert
        result.Should().BeOfType<BadRequestObjectResult>();
        log.Logged.Single().Verify(LogLevel.Error, exception);
    }

    [Fact]
    public async Task Get_ShouldLogInformation_And_ReturnOk_OnPosApiException_102()
    {
        // Setup
        var exception = new PosApiException(message: "error", posApiCode: 102, posApiMessage: "pos api error");
        posApiRetailServiceMock.Setup(s => s.GetDnaAbuserInformationAsync(ExecutionMode.Async(ct))).ThrowsAsync(exception);

        // Act
        var result = await target.Get(ct);

        // Assert
        result.Should().BeOfType<OkObjectResult>();
        log.Logged.Single().Verify(LogLevel.Information, exception, ("PosApiCode", 102), ("PosApiMessage", "pos api error"));
    }

    [Fact]
    public async Task Get_ShouldLogError_OnGeneralException()
    {
        // Setup
        var exception = new Exception(message: "error");
        posApiRetailServiceMock.Setup(s => s.GetDnaAbuserInformationAsync(ExecutionMode.Async(ct))).ThrowsAsync(exception);

        // Act
        var result = await target.Get(ct);

        // Assert
        result.Should().BeOfType<BadRequestObjectResult>();
        log.Logged.Single().Verify(LogLevel.Error, exception);
    }
}
