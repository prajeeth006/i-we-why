using System;
using System.Net.Http;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Services.ResponsibleGaming.ScreenTime;
using Frontend.Vanilla.ServiceClients.Tests.TestUtilities;
using Moq;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.ScreenTime;

public class ScreenTimeServiceClientTests : ServiceClientTestsBase
{
    protected override void Setup() { }

    [Fact]
    public async Task SaveScreenTimeTest()
    {
        PosApiRestRequest invokedRequest = null;
        var restClientMock = new Mock<IPosApiRestClient>();
        restClientMock.Setup(r => r.ExecuteAsync(TestMode, It.IsAny<PosApiRestRequest>()))
            .Callback((ExecutionMode mode, PosApiRestRequest request) => invokedRequest = request);

        var client = new ScreenTimeServiceClient(restClientMock.Object);
        var screenTimeSaveRequest = new ScreenTimeSaveRequest
        {
            ScreenTime = DateTime.MinValue,
            StartTime = DateTime.MaxValue,
            Mac = "blah",
        };

        await client.SaveScreenTimeAsync(screenTimeSaveRequest, TestMode);

        restClientMock.Verify(v => v.ExecuteAsync(
                TestMode,
                It.IsAny<PosApiRestRequest>()),
            Times.Once);

        invokedRequest.Should().NotBeNull();
        invokedRequest.Url.ToString().Contains("Arc/SaveScreenTime").Should().BeTrue();
        invokedRequest.Method.Should().Be(HttpMethod.Post);
        invokedRequest.Authenticate.Should().BeTrue();
        invokedRequest.Content.Should().Be(screenTimeSaveRequest);
    }
}
