using FluentAssertions;
using Frontend.SharedFeatures.Api.Features.SegmentationGroups;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Services.Account;
using Frontend.Vanilla.Testing;
using Frontend.Vanilla.Testing.Fakes;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace Frontend.SharedFeatures.Api.Tests.Features.SegmentationGroups;

public class SegmentationGroupsControllerTests
{
    private SegmentationGroupsController target;
    private Mock<IPosApiAccountService> posApiAccountService;
    private readonly TestLogger<SegmentationGroupsController> log;
    private readonly CancellationToken ct;

    public SegmentationGroupsControllerTests()
    {
        posApiAccountService = new Mock<IPosApiAccountService>();
        log = new TestLogger<SegmentationGroupsController>();
        ct = new CancellationTokenSource().Token;

        target = new SegmentationGroupsController(posApiAccountService.Object, log);
    }

    [Fact]
    public async Task Get_ShouldReturnOK_OnSuccess()
    {
        posApiAccountService.Setup(p => p.GetSegmentationGroupsAsync(ct)).ReturnsAsync(new List<string>() { "nba" });

        var result = (OkObjectResult)await target.Get(ct);

        result.Value.Should().BeEquivalentTo(new { groups = new List<string>() { "nba" } });
        posApiAccountService.Verify(p => p.GetSegmentationGroupsAsync(ct), Times.Once);
    }

    [Fact]
    public async Task Get_ShouldReturnError_OnPosApiException()
    {
        posApiAccountService.Setup(p => p.GetSegmentationGroupsAsync(ct))
            .Throws(new PosApiException(posApiCode: 55, posApiMessage: "Error"));

        var response = await target.Get(ct);

        response.GetOriginalResult<BadRequestObjectResult>().Should().NotBeNull();
    }

    [Fact]
    public async Task Get_ShouldReturnError_OnException()
    {
        posApiAccountService.Setup(p => p.GetSegmentationGroupsAsync(ct)).Throws(new Exception());

        var response = await target.Get(ct);

        response.GetOriginalResult<BadRequestObjectResult>().Should().NotBeNull();
    }
}
