using FluentAssertions;
using Frontend.SharedFeatures.Api.Features.SelfExclusion;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Services.ResponsibleGaming;
using Frontend.Vanilla.ServiceClients.Services.ResponsibleGaming.SelfExclusion;
using Frontend.Vanilla.Testing;
using Frontend.Vanilla.Testing.Fakes;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace Frontend.SharedFeatures.Api.Tests.Features.SelfExclusion;

public class SelfExclusionControllerTests
{
    private SelfExclusionController target;
    private Mock<IPosApiResponsibleGamingServiceInternal> posApiResponsibleGamingServiceMock;
    private readonly TestLogger<SelfExclusionController> log;
    private readonly CancellationToken ct;

    public SelfExclusionControllerTests()
    {
        posApiResponsibleGamingServiceMock = new Mock<IPosApiResponsibleGamingServiceInternal>();
        log = new TestLogger<SelfExclusionController>();
        ct = new CancellationTokenSource().Token;

        target = new SelfExclusionController(posApiResponsibleGamingServiceMock.Object, log);
    }

    [Fact]
    public async Task Get_ShouldReturnOK_OnSuccess()
    {
        posApiResponsibleGamingServiceMock.Setup(p => p.GetSelfExclusionDetailsAsync(It.IsAny<ExecutionMode>()))
            .ReturnsAsync(new SelfExclusionDetails("self", new UtcDateTime(2021, 5, 12), new UtcDateTime(2021, 11, 2)));

        var result = (OkObjectResult)await target.GetDetails(ct);

        result.Value.Should().BeEquivalentTo(new { CategoryId = "self", StartDate = new UtcDateTime(2021, 5, 12), EndDate = new UtcDateTime(2021, 11, 2) });
        posApiResponsibleGamingServiceMock.Verify(p => p.GetSelfExclusionDetailsAsync(It.IsAny<ExecutionMode>()), Times.Once);
    }

    [Fact]
    public async Task Get_ShouldReturnError_OnPosApiException()
    {
        posApiResponsibleGamingServiceMock.Setup(o => o.GetSelfExclusionDetailsAsync(It.IsAny<ExecutionMode>()))
            .Throws(new PosApiException(posApiCode: 55, posApiMessage: "Error"));

        var response = await target.GetDetails(ct);

        response.GetOriginalResult<BadRequestObjectResult>().Should().NotBeNull();
    }

    [Fact]
    public async Task Get_ShouldReturnError_OnException()
    {
        posApiResponsibleGamingServiceMock.Setup(o => o.GetSelfExclusionDetailsAsync(It.IsAny<ExecutionMode>())).Throws(new Exception());

        var response = await target.GetDetails(ct);

        response.GetOriginalResult<BadRequestObjectResult>().Should().NotBeNull();
    }
}
