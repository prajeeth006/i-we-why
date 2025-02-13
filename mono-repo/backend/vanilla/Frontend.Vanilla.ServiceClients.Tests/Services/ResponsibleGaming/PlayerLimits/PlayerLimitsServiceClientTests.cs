using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Services.ResponsibleGaming.PlayerLimits;
using Frontend.Vanilla.ServiceClients.Tests.TestUtilities;
using Moq;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.ResponsibleGaming.PlayerLimits;

public class PlayerLimitsServiceClientTests : ServiceClientTestsBase
{
    private IPlayerLimitsServiceClient target;
    private Mock<IPosApiRestClient> restClientMock;

    protected override void Setup()
    {
        restClientMock = new Mock<IPosApiRestClient>();
        restClientMock.Setup(s => s.ExecuteAsync<PlayerLimitsResponse>(It.IsAny<ExecutionMode>(), It.IsAny<PosApiRestRequest>()))
            .ReturnsAsync(new PlayerLimitsResponse { Limits = new List<Limit> { new Limit() }, WaitingPeriodInDays = 30 });

        target = new PlayerLimitsServiceClient(restClientMock.Object);
    }

    [Fact]
    public async Task GetPlayerLimitsAsync_ShouldExecuteCorrectly()
    {
        // Act
        var result = await target.GetPlayerLimitsAsync(TestMode);

        // Assert
        restClientMock.Verify(v => v.ExecuteAsync<PlayerLimitsResponse>(TestMode,
            It.Is<PosApiRestRequest>(p => p.Url.ToString().Contains("ResponsibleGaming.svc/Limits/Player") &&
                                          p.Authenticate && p.Method == HttpMethod.Get)), Times.Once);

        result.Should().NotBeNull();
        result.WaitingPeriodInDays.Should().Be(30);
        result.Limits.Count.Should().Be(1);
    }
}
