using System.Net.Http;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Services.ResponsibleGaming.PlayerArea;
using Frontend.Vanilla.ServiceClients.Tests.TestUtilities;
using Moq;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.ResponsibleGaming.PlayerArea;

public class PlayerAreaServiceClientTests : ServiceClientTestsBase
{
    protected override void Setup() { }

    [Fact]
    public async Task SetPlayerAreaTest()
    {
        PosApiRestRequest invokedRequest = null;
        var restClientMock = new Mock<IPosApiRestClient>();
        restClientMock.Setup(r => r.ExecuteAsync(TestMode, It.IsAny<PosApiRestRequest>()))
            .Callback((ExecutionMode mode, PosApiRestRequest request) => invokedRequest = request);

        var client = new PlayerAreaServiceClient(restClientMock.Object);
        var setPlayerAreaRequest = new SetPlayerAreaRequest()
        {
            OldArea = "sports",
            NewArea = "casino",
            EventTime = UtcDateTime.UnixEpoch,
        };

        await client.SetPlayerAreaAsync(setPlayerAreaRequest, TestMode);

        restClientMock.Verify(v => v.ExecuteAsync(
                TestMode,
                It.IsAny<PosApiRestRequest>()),
            Times.Once);

        invokedRequest.Should().NotBeNull();
        invokedRequest.Url.ToString().Contains("ResponsibleGaming.svc/PlayerArea").Should().BeTrue();
        invokedRequest.Method.Should().Be(HttpMethod.Post);
        invokedRequest.Authenticate.Should().BeTrue();
        invokedRequest.Content.Should().Be(setPlayerAreaRequest);
    }
}
