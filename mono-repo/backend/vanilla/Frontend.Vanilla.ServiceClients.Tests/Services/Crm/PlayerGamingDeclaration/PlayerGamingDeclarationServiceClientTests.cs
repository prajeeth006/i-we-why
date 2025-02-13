using System;
using System.Net.Http;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Services.Crm.PlayerGamingDeclaration;
using Frontend.Vanilla.ServiceClients.Tests.TestUtilities;
using Moq;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.Crm.PlayerGamingDeclaration;

public sealed class PlayerGamingDeclarationServiceClientTests : ServiceClientTestsBase
{
    private PlayerGamingDeclarationServiceClient target;
    private Mock<IPosApiRestClient> restClientMock;
    private readonly GamingDeclaration gamingDeclarationResponse = new GamingDeclaration("Y", new DateTime(2022, 1, 1));

    protected override void Setup()
    {
        restClientMock = new Mock<IPosApiRestClient>();
        target = new PlayerGamingDeclarationServiceClient(restClientMock.Object);
        restClientMock.Setup(s => s.ExecuteAsync<GamingDeclaration>(
                It.IsAny<ExecutionMode>(),
                It.IsAny<PosApiRestRequest>()))
            .ReturnsAsync(gamingDeclarationResponse);
    }

    [Fact]
    public async Task GetAsync_ShouldExecuteCorrectly()
    {
        // Act
        var result = await target.GetAsync(TestMode);

        // Assert
        restClientMock.Verify(v => v.ExecuteAsync<GamingDeclaration>(TestMode,
            It.Is<PosApiRestRequest>(p => p.Url.ToString().Contains("CRM.svc/PlayerGamingDeclaration") &&
                                          p.Authenticate && p.Method == HttpMethod.Get)), Times.Once);

        result.Should().NotBeNull();
        result.AcceptedDate.Should().Be(new DateTime(2022, 1, 1));
        result.Status.Should().Be("Y");
    }

    [Fact]
    public async Task GetAsync_ShouldExecuteCorrectlyWithNullDate()
    {
        restClientMock.Setup(s => s.ExecuteAsync<GamingDeclaration>(
                It.IsAny<ExecutionMode>(),
                It.IsAny<PosApiRestRequest>()))
            .ReturnsAsync(new GamingDeclaration("N", null));

        // Act
        var result = await target.GetAsync(TestMode);

        // Assert
        restClientMock.Verify(v => v.ExecuteAsync<GamingDeclaration>(TestMode,
            It.Is<PosApiRestRequest>(p => p.Url.ToString().Contains("CRM.svc/PlayerGamingDeclaration") &&
                                          p.Authenticate && p.Method == HttpMethod.Get)), Times.Once);

        result.Should().NotBeNull();
        result.AcceptedDate.Should().BeNull();
        result.Status.Should().Be("N");
    }

    [Fact]
    public async Task Accept_ShouldExecuteCorrectly()
    {
        var callCount = 0;
        PosApiRestRequest posApiRestRequest = null;
        restClientMock.Setup(s => s.ExecuteAsync(
                It.IsAny<ExecutionMode>(),
                It.IsAny<PosApiRestRequest>()))
            .Callback((ExecutionMode mode, PosApiRestRequest request) =>
            {
                callCount++;
                posApiRestRequest = request;
            });

        await target.AcceptDeclarationAsync(new GamingDeclarationRequest("N"), TestMode);

        // Assert
        posApiRestRequest.Should().NotBeNull("ExecuteAsync<GamingDeclaration> Should Be Called");
        callCount.Should().Be(1, "ExecuteAsync<GamingDeclaration> Should Be Called only Once");
        posApiRestRequest.Url.Should().Be("CRM.svc/PlayerGamingDeclaration");
        posApiRestRequest.Method.Should().Be(HttpMethod.Post);
        posApiRestRequest.Authenticate.Should().BeTrue();
        posApiRestRequest.Content.Should().NotBeNull();
        var request = posApiRestRequest.Content as GamingDeclarationRequest;
        request?.Status.Should().Be("N");
    }
}
