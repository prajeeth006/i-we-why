using FluentAssertions;
using Frontend.SharedFeatures.Api.Features.SessionInfo;
using Frontend.Vanilla.Features.Json.ActionResults;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Services.ResponsibleGaming;
using Frontend.Vanilla.ServiceClients.Services.ResponsibleGaming.RealityCheck;
using Frontend.Vanilla.Testing;
using Frontend.Vanilla.Testing.Fakes;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace Frontend.SharedFeatures.Api.Tests.Features.SessionInfo;

public class SessionInfoControllerTest
{
    private readonly Mock<IPosApiResponsibleGamingServiceInternal> posApiResponsibleGamingServiceInternal;
    private readonly CancellationToken ct;
    private readonly TestLogger<SessionInfoController> log;
    private readonly SessionInfoController target;

    public SessionInfoControllerTest()
    {
        ct = new CancellationTokenSource().Token;
        posApiResponsibleGamingServiceInternal = new Mock<IPosApiResponsibleGamingServiceInternal>();
        log = new TestLogger<SessionInfoController>();
        target = new SessionInfoController(posApiResponsibleGamingServiceInternal.Object, log);
    }

    [Fact]
    public async Task RcpuStatus_ShouldReturnOK_OnSuccess()
    {
        posApiResponsibleGamingServiceInternal.Setup(o => o.RcpuStatusAsync(It.IsAny<CancellationToken>())).ReturnsAsync(new RcpuStatusResponse());

        var response = await target.RcpuStatus(ct);

        response.Should().BeOfType<OkObjectResult>();
        posApiResponsibleGamingServiceInternal.Verify(o => o.RcpuStatusAsync(ct));
    }

    [Fact]
    public async Task RcpuStatus_ShouldReturnError_OnPosApiException()
    {
        posApiResponsibleGamingServiceInternal.Setup(o => o.RcpuStatusAsync(It.IsAny<CancellationToken>()))
            .Throws(new PosApiException(posApiCode: 55, posApiMessage: "Error"));

        var response = await target.RcpuStatus(ct);

        response.GetOriginalResult<BadRequestObjectResult>().Should().NotBeNull();
        response.GetResultsOfType<TechnicalErrorMessageResult>().Should().NotBeNull();
    }

    [Fact]
    public async Task RcpuStatus_ShouldReturnError_OnPosException()
    {
        posApiResponsibleGamingServiceInternal.Setup(o => o.RcpuStatusAsync(It.IsAny<CancellationToken>())).Throws(new Exception());

        var response = await target.RcpuStatus(ct);

        response.GetOriginalResult<BadRequestObjectResult>().Should().NotBeNull();
        response.GetResultsOfType<TechnicalErrorMessageResult>().Should().NotBeNull();
    }

    [Fact]
    public async Task RcpuContinue_ShouldReturnOK_OnSuccess()
    {
        posApiResponsibleGamingServiceInternal.Setup(o => o.RcpuContinueAsync(It.IsAny<CancellationToken>())).Returns(Task.FromResult(true));

        var response = await target.RcpuContinue(ct);

        response.Should().BeOfType<OkObjectResult>();
        posApiResponsibleGamingServiceInternal.Verify(o => o.RcpuContinueAsync(ct));
    }

    [Fact]
    public async Task RcpuContinue_ShouldReturnError_OnPosApiException()
    {
        posApiResponsibleGamingServiceInternal.Setup(o => o.RcpuContinueAsync(It.IsAny<CancellationToken>()))
            .Throws(new PosApiException(posApiCode: 55, posApiMessage: "Error"));

        var response = await target.RcpuContinue(ct);

        response.GetOriginalResult<BadRequestObjectResult>().Should().NotBeNull();
        response.GetResultsOfType<TechnicalErrorMessageResult>().Should().NotBeNull();
    }

    [Fact]
    public async Task RcpuContinue_ShouldReturnError_OnPosException()
    {
        posApiResponsibleGamingServiceInternal.Setup(o => o.RcpuContinueAsync(It.IsAny<CancellationToken>())).Throws(new Exception());

        var response = await target.RcpuContinue(ct);

        response.GetOriginalResult<BadRequestObjectResult>().Should().NotBeNull();
        response.GetResultsOfType<TechnicalErrorMessageResult>().Should().NotBeNull();
    }

    [Fact]
    public async Task RcpuQuit_ShouldReturnOK_OnSuccess()
    {
        posApiResponsibleGamingServiceInternal.Setup(o => o.RcpuQuitAsync(It.IsAny<CancellationToken>())).Returns(Task.FromResult(true));

        var response = await target.RcpuQuit(ct);

        response.Should().BeOfType<OkObjectResult>();
        posApiResponsibleGamingServiceInternal.Verify(o => o.RcpuQuitAsync(ct));
    }

    [Fact]
    public async Task RcpuQuit_ShouldReturnError_OnPosApiException()
    {
        posApiResponsibleGamingServiceInternal.Setup(o => o.RcpuQuitAsync(It.IsAny<CancellationToken>()))
            .Throws(new PosApiException(posApiCode: 55, posApiMessage: "Error"));

        var response = await target.RcpuQuit(ct);

        response.GetOriginalResult<BadRequestObjectResult>().Should().NotBeNull();
        response.GetResultsOfType<TechnicalErrorMessageResult>().Should().NotBeNull();
    }

    [Fact]
    public async Task RcpuQuit_ShouldReturnError_OnPosException()
    {
        posApiResponsibleGamingServiceInternal.Setup(o => o.RcpuQuitAsync(It.IsAny<CancellationToken>())).Throws(new Exception());

        var response = await target.RcpuQuit(ct);

        response.GetOriginalResult<BadRequestObjectResult>().Should().NotBeNull();
        response.GetResultsOfType<TechnicalErrorMessageResult>().Should().NotBeNull();
    }
}
