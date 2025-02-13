using FluentAssertions;
using Frontend.SharedFeatures.Api.Features.DepositLimits;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Services.ResponsibleGaming;
using Frontend.Vanilla.ServiceClients.Services.ResponsibleGaming.DepositLimits;
using Frontend.Vanilla.Testing;
using Frontend.Vanilla.Testing.Fakes;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace Frontend.SharedFeatures.Api.Tests.Features.DepositLimits;

public sealed class DepositLimitsControllerTests
{
    private DepositLimitsController target;
    private Mock<IPosApiResponsibleGamingServiceInternal> posApiResponsibleGamingServiceMock;
    private readonly TestLogger<DepositLimitsController> log;
    private readonly CancellationToken ct;

    public DepositLimitsControllerTests()
    {
        posApiResponsibleGamingServiceMock = new Mock<IPosApiResponsibleGamingServiceInternal>();
        log = new TestLogger<DepositLimitsController>();
        ct = new CancellationTokenSource().Token;

        target = new DepositLimitsController(posApiResponsibleGamingServiceMock.Object, log);
    }

    [Fact]
    public async Task Get_ShouldReturnOK_OnSuccess()
    {
        var response = new List<DepositLimit>()
        {
            new DepositLimit(200, "Daily", true),
            new DepositLimit(null, "Weekly", false),
        };
        posApiResponsibleGamingServiceMock.Setup(p => p.GetDepositLimitsAsync(It.IsAny<ExecutionMode>())).ReturnsAsync(response);

        var result = (OkObjectResult)await target.GetDepositLimits(ct);

        result.Value.Should().BeEquivalentTo(new { limits = response });
        posApiResponsibleGamingServiceMock.Verify(p => p.GetDepositLimitsAsync(It.IsAny<ExecutionMode>()), Times.Once);
    }

    [Fact]
    public async Task Get_ShouldReturnError_OnPosApiException()
    {
        posApiResponsibleGamingServiceMock.Setup(o => o.GetDepositLimitsAsync(It.IsAny<ExecutionMode>()))
            .Throws(new PosApiException(posApiCode: 55, posApiMessage: "Error"));

        var response = await target.GetDepositLimits(ct);

        response.GetOriginalResult<BadRequestObjectResult>().Should().NotBeNull();
    }

    [Fact]
    public async Task Get_ShouldReturnError_OnException()
    {
        posApiResponsibleGamingServiceMock.Setup(o => o.GetDepositLimitsAsync(It.IsAny<ExecutionMode>())).Throws(new Exception());

        var response = await target.GetDepositLimits(ct);

        response.GetOriginalResult<BadRequestObjectResult>().Should().NotBeNull();
    }
}
