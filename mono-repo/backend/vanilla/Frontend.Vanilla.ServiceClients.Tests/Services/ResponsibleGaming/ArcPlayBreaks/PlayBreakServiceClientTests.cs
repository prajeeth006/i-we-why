using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.System.Uris;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Infrastructure.GenericServiceClients;
using Frontend.Vanilla.ServiceClients.Services;
using Frontend.Vanilla.ServiceClients.Services.ResponsibleGaming.ArcPlayBreaks;
using Frontend.Vanilla.ServiceClients.Tests.TestUtilities;
using Moq;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.ResponsibleGaming.ArcPlayBreaks;

public sealed class PlayBreakServiceClientTests : ServiceClientTestsBase
{
    private PlayBreakServiceClient target;
    private Mock<IPosApiRestClient> restClientMock;
    private Mock<IGetDataServiceClient> getDataServiceClientMock;
    private Mock<IServiceClientsConfiguration> configMock;

    private readonly ArcPlayBreakResponse arcPlayBreakResponse = new ()
    {
        PlayBreak = true,
        PlayBreakType = "TEST_TYPE",
        PlayBreakEndTime = new DateTime(2021, 01, 01),
    };

    private readonly ArcPlayBreakActionResponse arcPlayBreakActionResponse = new ()
    {
        ResponseCode = null,
        ResponseMessage = "TEST",
    };

    protected override void Setup()
    {
        restClientMock = new Mock<IPosApiRestClient>();
        getDataServiceClientMock = new Mock<IGetDataServiceClient>();
        configMock = new Mock<IServiceClientsConfiguration>();
        target = new PlayBreakServiceClient(restClientMock.Object, getDataServiceClientMock.Object, configMock.Object);
    }

    [Fact]
    public async Task GetAsync_ShouldExecuteCorrectly()
    {
        getDataServiceClientMock.Setup(s => s.GetAsync<ArcPlayBreakResponse, ArcPlayBreakResponse>(
                It.IsAny<ExecutionMode>(),
                PosApiDataType.User,
                PosApiEndpoint.ResponsibleGaming.ArcPlayBreakStatus,
                true,
                It.IsAny<RequiredString>(),
                It.IsAny<TimeSpan>()))
            .ReturnsAsync(arcPlayBreakResponse);

        configMock.SetupGet(c => c.CacheTimeEndpoints).Returns(new Dictionary<string, TimeSpan>
            { { "GetPlayBreak", TimeSpan.FromMinutes(1) } });

        // Act
        var result = await target.GetAsync(TestMode, true);

        // Assert
        getDataServiceClientMock.Verify(v => v.GetAsync<ArcPlayBreakResponse, ArcPlayBreakResponse>(TestMode,
            PosApiDataType.User,
            It.IsAny<PathRelativeUri>(),
            true,
            "GetPlayBreak",
            TimeSpan.FromMinutes(1)), Times.Once);

        result.Should().NotBeNull();
        result.PlayBreak.Should().BeTrue();
        result.PlayBreakType.Should().Be("TEST_TYPE");
        result.PlayBreakEndTime.Should().BeSameDateAs(new DateTime(2021, 01, 01));
    }

    [Fact]
    public async Task AcknowledgePlayBreakAction_ShouldExecuteCorrectly()
    {
        var callCount = 0;
        PosApiRestRequest posApiRestRequest = null;
        restClientMock.Setup(s => s.ExecuteAsync<ArcPlayBreakActionResponse>(
                It.IsAny<ExecutionMode>(),
                It.IsAny<PosApiRestRequest>()))
            .Callback((ExecutionMode mode, PosApiRestRequest request) =>
            {
                callCount++;
                posApiRestRequest = request;
            })
            .ReturnsAsync(arcPlayBreakActionResponse);

        var result = await target.AcknowledgePlayBreakAction(
            new ArcPlayBreakActionRequest
            {
                ActionName = "TestAction",
            },
            TestMode);

        // Assert
        posApiRestRequest.Should().NotBeNull("ExecuteAsync<ArcPlayBreakActionResponse> Should Be Called");
        callCount.Should().Be(1, "ExecuteAsync<ArcPlayBreakActionResponse> Should Be Called only Once");
        posApiRestRequest.Url.Should().Be("ResponsibleGaming.svc/Arc/AcknowledgePlayBreakAction");
        posApiRestRequest.Method.Should().Be(HttpMethod.Post);
        posApiRestRequest.Authenticate.Should().BeTrue();
        posApiRestRequest.Content.Should().NotBeNull();
        var request = posApiRestRequest.Content as ArcPlayBreakActionRequest;
        request?.ActionName.Should().Be("TestAction");

        result.Should().NotBeNull();
        result.ResponseCode.Should().Be(arcPlayBreakActionResponse.ResponseCode);
        result.ResponseMessage.Should().Be(arcPlayBreakActionResponse.ResponseMessage);
    }
}
