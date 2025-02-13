using FluentAssertions;
using Frontend.SharedFeatures.Api.Features.EdsGroup;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Features.EdsGroup;
using Frontend.Vanilla.ServiceClients.Services.Notification;
using Frontend.Vanilla.ServiceClients.Services.Notification.EdsGroup;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace Frontend.SharedFeatures.Api.Tests.Features.EdsGroup;

public class EdsGroupControllerTests
{
    private readonly EdsGroupController target;
    private readonly Mock<IEdsGroupService> edsGroupService;
    private readonly CancellationToken ct;

    public EdsGroupControllerTests()
    {
        edsGroupService = new Mock<IEdsGroupService>();
        var posApiNotificationService = new Mock<IPosApiNotificationService>();
        var logger = new Mock<ILogger<EdsGroupController>>();

        target = new EdsGroupController(edsGroupService.Object, posApiNotificationService.Object, logger.Object) { };
        ct = new CancellationTokenSource().Token;
    }

    [Fact]
    public async Task ShouldUpdateOfferEventStatusOnPost()
    {
        edsGroupService
            .Setup(s => s.OptInAsync(It.IsAny<ExecutionMode>(), It.IsAny<EdsGroupOptInRequest>()))
            .ReturnsAsync("foo");

        var result = (OkObjectResult)await target.PostAsync("569", true, ct); // Act

        result.Value.Should().BeEquivalentTo(new { Status = "foo" });
        edsGroupService.Verify(s => s.OptInAsync(ExecutionMode.Async(ct), It.IsAny<EdsGroupOptInRequest>()));
    }
}
