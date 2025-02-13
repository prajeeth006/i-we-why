using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Services.Wallet.PlayerActivitySummary;
using Frontend.Vanilla.Testing.Xunit;
using Moq;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.Wallet.PlayerActivitySummary;

public class PlayerActivitySummaryServiceClientTests : WalletServiceClientTestsBase
{
    private IPlayerActivitySummaryServiceClient target;

    protected override void Setup()
    {
        base.Setup();

        PosApiRestClientMock.Setup(s => s.ExecuteAsync<ActivitySummaryDto>(TestMode, It.IsAny<PosApiRestRequest>()))
            .ReturnsAsync(new ActivitySummaryDto());

        target = new PlayerActivitySummaryServiceClient(PosApiRestClientMock.Object, Cache.Object, RequestSemaphoresMock.Object);
    }

    [Theory, BooleanData]
    public async Task GetAsync_ShouldExecuteCorrectly(bool cached)
    {
        // Act
        var result = await target.GetAsync(TestMode, cached);

        // Assert
        VerifyGetAsync<ActivitySummaryDto>(cached, "PlayerActivitySummary");
        VerifyActivitySummary(result);
    }

    private static void VerifyActivitySummary(ActivitySummary result)
    {
        result.AccountCurrency.Should().Be(string.Empty);
        result.NetLoss.Should().Be(0);
        result.NetLoss.Should().Be(0);
    }
}
