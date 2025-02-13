using FluentAssertions;
using Frontend.SharedFeatures.Api.Features.SofStatus;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Services.Account;
using Frontend.Vanilla.ServiceClients.Services.Account.SofStatus;
using Frontend.Vanilla.Testing;
using Frontend.Vanilla.Testing.Fakes;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace Frontend.SharedFeatures.Api.Tests.Features.SofStatus;

public class SofStatusDetailsControllerTests
{
    private SofStatusDetailsController target;
    private Mock<IPosApiAccountServiceInternal> posApiAccountServiceInternalMock;
    private readonly TestLogger<SofStatusDetailsController> log;
    private readonly CancellationToken ct;

    public SofStatusDetailsControllerTests()
    {
        posApiAccountServiceInternalMock = new Mock<IPosApiAccountServiceInternal>();
        log = new TestLogger<SofStatusDetailsController>();
        ct = new CancellationTokenSource().Token;

        target = new SofStatusDetailsController(posApiAccountServiceInternalMock.Object, log);
    }

    [Fact]
    public async Task Get_ShouldReturnOK_OnSuccess()
    {
        posApiAccountServiceInternalMock.Setup(p => p.GetSofStatusDetailsAsync(It.IsAny<ExecutionMode>(), It.IsAny<bool>())).ReturnsAsync(new SofStatusDetails("red"));

        var result = (OkObjectResult)await target.Get(ct);

        result.Value.Should().BeEquivalentTo(new { SofStatus = "red", RedStatusDays = -1 });
        posApiAccountServiceInternalMock.Verify(p => p.GetSofStatusDetailsAsync(It.IsAny<ExecutionMode>(), It.IsAny<bool>()), Times.Once);
    }

    [Fact]
    public async Task Get_ShouldReturnError_OnPosApiException()
    {
        posApiAccountServiceInternalMock.Setup(o => o.GetSofStatusDetailsAsync(It.IsAny<ExecutionMode>(), It.IsAny<bool>()))
            .Throws(new PosApiException(posApiCode: 55, posApiMessage: "Error"));

        var response = await target.Get(ct);

        response.GetOriginalResult<BadRequestObjectResult>().Should().NotBeNull();
    }

    [Fact]
    public async Task Get_ShouldReturnError_OnException()
    {
        posApiAccountServiceInternalMock.Setup(o => o.GetSofStatusDetailsAsync(It.IsAny<ExecutionMode>(), It.IsAny<bool>())).Throws(new Exception());

        var response = await target.Get(ct);

        response.GetOriginalResult<BadRequestObjectResult>().Should().NotBeNull();
    }
}
