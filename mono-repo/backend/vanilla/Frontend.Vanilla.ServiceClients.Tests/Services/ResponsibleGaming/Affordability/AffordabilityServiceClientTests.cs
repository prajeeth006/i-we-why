using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Services;
using Frontend.Vanilla.ServiceClients.Services.ResponsibleGaming.Affordability;
using Frontend.Vanilla.ServiceClients.Tests.TestUtilities;
using Moq;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.ResponsibleGaming.Affordability;

public class AffordabilityServiceClientTests : ServiceClientTestsBase
{
    private AffordabilityServiceClient target;
    private Mock<IPosApiRestClient> restClientMock;

    protected override void Setup()
    {
        restClientMock = new Mock<IPosApiRestClient>();

        target = new AffordabilityServiceClient(restClientMock.Object);
    }

    [Fact]
    public async Task GetAffordabilitySnapshotDetailsAsync_ShouldReturnValue()
    {
        // Setup
        var response = new AffordabilitySnapshotDetailsResponse
        {
            AffordabilityStatus = "AffordabilityStatus",
            EmploymentGroup = "EmploymentGroup",
        };
        restClientMock.Setup(s => s.ExecuteAsync<AffordabilitySnapshotDetailsResponse>(
                It.IsAny<PosApiRestRequest>(),
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(response);

        // Act
        var result = await target.GetAffordabilitySnapshotDetailsAsync(TestMode.AsyncCancellationToken.Value);

        // Assert
        restClientMock.Verify(x => x.ExecuteAsync<AffordabilitySnapshotDetailsResponse>(
                It.Is<PosApiRestRequest>(p =>
                    p.Url.ToString().Contains(PosApiEndpoint.ResponsibleGaming.AffordabilitySnapshotDetailsV2.ToString()) &&
                    p.Authenticate &&
                    p.Method == HttpMethod.Post),
                It.IsAny<CancellationToken>()),
            Times.Once);

        result.Should().Be(response);
    }
}
