using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Features.EdsGroup;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Services.Notification;
using Frontend.Vanilla.ServiceClients.Services.Notification.EdsGroup;
using Frontend.Vanilla.Testing.Fakes;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.EdsGroup;

public sealed class EdsGroupServiceTests
{
    private IEdsGroupService target;
    private Mock<IPosApiNotificationService> posApiNotificationService;
    private ExecutionMode executionMode;

    public EdsGroupServiceTests()
    {
        posApiNotificationService = new Mock<IPosApiNotificationService>();
        executionMode = TestExecutionMode.Get();

        target = new EdsGroupService(posApiNotificationService.Object);
    }

    [Fact]
    public async Task OptInAsync_ShouldWork()
    {
        posApiNotificationService
            .Setup(c => c.UpdateEdsGroupStatusAsync(executionMode, It.IsAny<EdsGroupOptInRequest>()))
            .ReturnsAsync(new EdsGroupOptIn(true));

        var result = await target.OptInAsync(executionMode, new EdsGroupOptInRequest()); // act

        result.Should().Be("OPTED-IN");
    }

    [Theory]
    [InlineData(418, "ERROR")]
    [InlineData(419, "INVALID")]
    [InlineData(420, "EXPIRED")]
    [InlineData(421, "INVALID")]
    [InlineData(422, "NOT-OFFERED")]
    [InlineData(423, "OPTINS-EXCEEDED")]
    [InlineData(424, "INCOMPLETE")]
    [InlineData(500, "ERROR")]
    public async Task OptInAsync_ShouldMapErrorToStatus(int posApiError, string status)
    {
        posApiNotificationService.Setup(c => c.UpdateEdsGroupStatusAsync(executionMode, It.IsAny<EdsGroupOptInRequest>()))
            .ThrowsAsync(new PosApiException(posApiCode: posApiError));

        var result = await target.OptInAsync(executionMode, new EdsGroupOptInRequest()); // act

        result.Should().Be(status);
    }
}
